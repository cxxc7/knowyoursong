import { useState } from "react";
import { Play, ExternalLink, Calendar, Eye, Heart, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface SongData {
  id: string;
  title: string;
  artist: string;
  album?: string;
  releaseDate: string;
  genre: string[];
  popularity: number;
  spotifyUrl?: string;
  youtubeUrl?: string;
  spotifyPlays?: number;
  youtubeViews?: number;
  albumCover?: string;
  preview?: string;
  lyrics?: string;
  chartPosition?: number;
  relatedSongs?: Array<{
    id: string;
    title: string;
    artist: string;
    albumCover?: string;
  }>;
}

interface SongCardProps {
  song: SongData;
}

export const SongCard = ({ song }: SongCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatNumber = (num?: number) => {
    if (!num) return "N/A";
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className="glass-card border-glass-border overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
            {song.albumCover ? (
              <img 
                src={song.albumCover} 
                alt={`${song.album} cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground truncate">{song.title}</h3>
            <p className="text-lg text-muted-foreground truncate">{song.artist}</p>
            {song.album && (
              <p className="text-sm text-muted-foreground truncate">from "{song.album}"</p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-2">
              {song.genre.slice(0, 2).map((g) => (
                <Badge key={g} variant="secondary" className="text-xs">
                  {g}
                </Badge>
              ))}
              {song.chartPosition && (
                <Badge className="bg-accent text-accent-foreground">
                  #{song.chartPosition} Chart
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>{song.popularity}% popularity</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Released</p>
            <p className="font-semibold">{new Date(song.releaseDate).getFullYear()}</p>
          </div>
          
          {song.spotifyPlays && (
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Heart className="w-5 h-5 mx-auto mb-1 text-green-500" />
              <p className="text-xs text-muted-foreground">Spotify Plays</p>
              <p className="font-semibold">{formatNumber(song.spotifyPlays)}</p>
            </div>
          )}
          
          {song.youtubeViews && (
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Eye className="w-5 h-5 mx-auto mb-1 text-red-500" />
              <p className="text-xs text-muted-foreground">YouTube Views</p>
              <p className="font-semibold">{formatNumber(song.youtubeViews)}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {song.spotifyUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-green-500/30 hover:bg-green-500/10"
              onClick={() => window.open(song.spotifyUrl, "_blank")}
            >
              <Play className="w-4 h-4 mr-2" />
              Play on Spotify
            </Button>
          )}
          
          {song.youtubeUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-red-500/30 hover:bg-red-500/10"
              onClick={() => window.open(song.youtubeUrl, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Watch on YouTube
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-4 border-t border-border pt-4">
            {song.lyrics && (
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Lyrics Preview</h4>
                <p className="text-sm text-muted-foreground italic bg-muted/30 p-3 rounded-lg">
                  {song.lyrics}
                </p>
              </div>
            )}
            
            {song.relatedSongs && song.relatedSongs.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-foreground">Related Songs</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {song.relatedSongs.slice(0, 4).map((related) => (
                    <div
                      key={related.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {related.albumCover ? (
                          <img 
                            src={related.albumCover} 
                            alt={`${related.title} cover`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{related.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{related.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};