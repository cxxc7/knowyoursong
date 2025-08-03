import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  onGoHome?: () => void;
}

export const SearchBar = ({ onSearch, isLoading, onGoHome }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular song suggestions for autocomplete
  const popularSongs = [
    "Bohemian Rhapsody", "Shape of You", "Blinding Lights", "Watermelon Sugar",
    "Bad Guy", "Someone You Loved", "Sunflower", "Old Town Road", "Señorita",
    "Thank U Next", "7 rings", "Shallow", "Perfect", "God's Plan", "Havana",
    "Despacito", "Thunder", "Believer", "Imagine Dragons", "Counting Stars",
    "Radioactive", "Can't Stop the Feeling", "Uptown Funk", "Happy", "Roar",
    "Dark Horse", "Shake It Off", "Blank Space", "Bad Blood", "Look What You Made Me Do"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 0) {
      const filtered = popularSongs.filter(song => 
        song.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for any song... (e.g., 'Bohemian Rhapsody', 'Shape of You')"
                value={query}
                onChange={handleInputChange}
                onFocus={() => query.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-12 h-14 bg-input border-border text-lg focus:ring-2 focus:ring-primary rounded-xl"
                disabled={isLoading}
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-3 hover:bg-accent cursor-pointer text-sm border-b last:border-b-0 border-border"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {onGoHome && (
                <Button
                  type="button"
                  onClick={onGoHome}
                  variant="outline"
                  className="h-14 px-6 font-semibold rounded-xl"
                >
                  Home
                </Button>
              )}
              <Button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="h-14 px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-accent text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};