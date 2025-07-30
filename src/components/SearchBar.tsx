import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

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
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-14 bg-input border-border text-lg focus:ring-2 focus:ring-primary rounded-xl"
                disabled={isLoading}
              />
            </div>
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
      </form>
    </div>
  );
};