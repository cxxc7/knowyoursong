import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SongCard, SongData } from "@/components/SongCard";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SearchResultsProps {
  results: SongData[];
  query: string;
}

export const SearchResults = ({ results, query }: SearchResultsProps) => {
  const [showAll, setShowAll] = useState(false);
  
  const displayResults = showAll ? results : results.slice(0, 5);
  const hasMore = results.length > 5;

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Search Results for "{query}"
        </h2>
        <p className="text-muted-foreground">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="space-y-6">
        {displayResults.map((song, index) => (
          <SongCard key={song.id || index} song={song} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="gap-2"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show More ({results.length - 5} more results)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};