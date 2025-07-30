import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { SearchBar } from "@/components/SearchBar";
import { SongCard, SongData } from "@/components/SongCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { WelcomeSection } from "@/components/WelcomeSection";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SongData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock data for demonstration - will be replaced with real API calls
  const mockSongData: SongData = {
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    releaseDate: "1975-10-31",
    genre: ["Rock", "Progressive Rock", "Art Rock"],
    popularity: 89,
    spotifyUrl: "https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv",
    youtubeUrl: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    spotifyPlays: 1600000000,
    youtubeViews: 1800000000,
    albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    lyrics: "Is this the real life? Is this just fantasy? Caught in a landslide, no escape from reality...",
    chartPosition: 1,
    relatedSongs: [
      {
        id: "2",
        title: "We Will Rock You",
        artist: "Queen",
        albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop"
      },
      {
        id: "3",
        title: "Don't Stop Me Now",
        artist: "Queen",
        albumCover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=100&h=100&fit=crop"
      }
    ]
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('search-song', {
        body: { query }
      });

      if (error) {
        throw new Error(error.message || 'Search failed');
      }
      setResults([data]);
      
      toast({
        title: "Search completed",
        description: `Found results for "${query}"`,
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Sorry, we couldn't find any results for "${query}". ${errorMessage}`);
      setResults([]);
      
      toast({
        title: "Search failed",
        description: "There was an error searching for the song.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setHasSearched(false);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {!hasSearched && <WelcomeSection />}
        
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {isLoading && <LoadingSpinner />}

        {error && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {results.length > 0 && !isLoading && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Search Results
              </h2>
              <p className="text-muted-foreground">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {results.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}

        {!hasSearched && (
          <div className="text-center mt-16 pb-8">
            <p className="text-muted-foreground">
              Ready to explore music? Search for any song above to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;