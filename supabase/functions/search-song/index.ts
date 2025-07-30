import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const SPOTIFY_CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID')!
const SPOTIFY_CLIENT_SECRET = Deno.env.get('SPOTIFY_CLIENT_SECRET')!
const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')!
const GENIUS_ACCESS_TOKEN = Deno.env.get('GENIUS_CLIENT_ACCESS_TOKEN')!

interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    release_date: string
    images: Array<{ url: string }>
  }
  popularity: number
  external_urls: { spotify: string }
  preview_url?: string
}

async function getSpotifyToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
    },
    body: 'grant_type=client_credentials'
  })
  
  if (!response.ok) {
    throw new Error(`Spotify auth failed: ${response.status}`)
  }
  
  const data = await response.json()
  return data.access_token
}

async function searchSpotify(query: string, token: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  )
  
  if (!response.ok) {
    console.error(`Spotify search failed: ${response.status}`)
    return undefined
  }
  
  const data = await response.json()
  return data.tracks?.items?.[0] as SpotifyTrack | undefined
}

async function getSpotifyRecommendations(trackId: string, token: string) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}&limit=4`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    )
    
    if (!response.ok) {
      console.error(`Spotify recommendations failed: ${response.status}`)
      return []
    }
    
    const text = await response.text()
    if (!text) {
      console.error('Empty response from Spotify recommendations')
      return []
    }
    
    const data = JSON.parse(text)
    return data.tracks || []
  } catch (error) {
    console.error('Error getting Spotify recommendations:', error)
    return []
  }
}

async function searchYouTube(query: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`
  )
  
  const data = await response.json()
  const video = data.items?.[0]
  
  if (!video) return null
  
  // Get video statistics
  const statsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${video.id.videoId}&key=${YOUTUBE_API_KEY}`
  )
  
  const statsData = await statsResponse.json()
  const stats = statsData.items?.[0]?.statistics
  
  return {
    id: video.id.videoId,
    url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
    viewCount: stats?.viewCount ? parseInt(stats.viewCount) : 0
  }
}

async function searchGenius(query: string) {
  const response = await fetch(
    `https://api.genius.com/search?q=${encodeURIComponent(query)}`,
    {
      headers: { 'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}` }
    }
  )
  
  const data = await response.json()
  const hit = data.response?.hits?.[0]?.result
  
  if (!hit) return null
  
  // Get song details
  const songResponse = await fetch(
    `https://api.genius.com/songs/${hit.id}`,
    {
      headers: { 'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}` }
    }
  )
  
  const songData = await songResponse.json()
  const song = songData.response?.song
  
  return {
    lyrics: song?.description?.plain ? song.description.plain.substring(0, 200) + '...' : null
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    
    if (!query) {
      throw new Error('Query is required')
    }

    // Get Spotify token and search
    const spotifyToken = await getSpotifyToken()
    const spotifyTrack = await searchSpotify(query, spotifyToken)
    
    if (!spotifyTrack) {
      throw new Error('Song not found')
    }

    // Search YouTube and Genius in parallel
    const [youtubeData, geniusData, recommendations] = await Promise.all([
      searchYouTube(`${spotifyTrack.artists[0].name} ${spotifyTrack.name}`),
      searchGenius(`${spotifyTrack.artists[0].name} ${spotifyTrack.name}`),
      getSpotifyRecommendations(spotifyTrack.id, spotifyToken)
    ])

    // Format the response
    const result = {
      id: spotifyTrack.id,
      title: spotifyTrack.name,
      artist: spotifyTrack.artists.map(a => a.name).join(', '),
      album: spotifyTrack.album.name,
      releaseDate: spotifyTrack.album.release_date,
      genre: [], // Spotify API doesn't provide genre in search, would need separate call
      popularity: spotifyTrack.popularity,
      spotifyUrl: spotifyTrack.external_urls.spotify,
      youtubeUrl: youtubeData?.url,
      spotifyPlays: null, // Not available in Spotify Web API
      youtubeViews: youtubeData?.viewCount,
      albumCover: spotifyTrack.album.images[0]?.url,
      preview: spotifyTrack.preview_url,
      lyrics: geniusData?.lyrics,
      chartPosition: null, // Would need Billboard API
      relatedSongs: recommendations.slice(0, 4).map((track: SpotifyTrack) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        albumCover: track.album.images[2]?.url || track.album.images[0]?.url
      }))
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})