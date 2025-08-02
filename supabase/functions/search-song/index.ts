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
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  )
  
  if (!response.ok) {
    console.error(`Spotify search failed: ${response.status}`)
    return []
  }
  
  const data = await response.json()
  return data.tracks?.items || []
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
    const spotifyTracks = await searchSpotify(query, spotifyToken)
    
    if (!spotifyTracks || spotifyTracks.length === 0) {
      throw new Error('Song not found')
    }

    // Get additional data for ALL tracks
    const tracksWithData = await Promise.all(
      spotifyTracks.map(async (track: SpotifyTrack, index: number) => {
        const [youtubeData, geniusData] = await Promise.all([
          searchYouTube(`${track.artists[0].name} ${track.name}`),
          index === 0 ? searchGenius(`${track.artists[0].name} ${track.name}`) : Promise.resolve(null)
        ])
        
        return {
          track,
          youtubeData,
          geniusData: index === 0 ? geniusData : null
        }
      })
    )

    // Get recommendations for the first track
    const firstTrack = spotifyTracks[0]
    const recommendations = await getSpotifyRecommendations(firstTrack.id, spotifyToken)

    // Format all tracks
    const results = tracksWithData.map(({ track, youtubeData, geniusData }, index) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      releaseDate: track.album.release_date,
      genre: [['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Country'][Math.floor(Math.random() * 5)]], // Random genres for demo
      popularity: track.popularity,
      spotifyUrl: track.external_urls.spotify,
      youtubeUrl: youtubeData?.url || null,
      spotifyPlays: Math.floor(Math.random() * 1000000000), // Mock data
      youtubeViews: youtubeData?.viewCount || Math.floor(Math.random() * 100000000),
      albumCover: track.album.images[0]?.url,
      preview: track.preview_url,
      lyrics: index === 0 ? (geniusData?.lyrics || 'Lyrics not available in demo mode. This is a preview of where full lyrics would appear.') : 'Lyrics not available in demo mode. This is a preview of where full lyrics would appear.',
      chartPosition: Math.floor(Math.random() * 100) + 1, // Mock chart position
      relatedSongs: index === 0 ? recommendations.slice(0, 4).map((relatedTrack: SpotifyTrack) => ({
        id: relatedTrack.id,
        title: relatedTrack.name,
        artist: relatedTrack.artists.map(a => a.name).join(', '),
        albumCover: relatedTrack.album.images[2]?.url || relatedTrack.album.images[0]?.url
      })) : []
    }))

    return new Response(JSON.stringify(results), {
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