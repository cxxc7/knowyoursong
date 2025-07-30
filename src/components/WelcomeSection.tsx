import { Music, Sparkles, TrendingUp, Play } from "lucide-react";

export const WelcomeSection = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse">
            <Music className="w-16 h-16 text-primary/50" />
          </div>
          <Music className="w-16 h-16 text-primary relative z-10" />
        </div>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-bold mb-4">
        <span className="gradient-text">Know</span>
        <span className="text-foreground">Your</span>
        <span className="gradient-text">Song</span>
      </h1>
      
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Discover everything about any song - from artist details and chart history 
        to lyrics and related tracks. Your ultimate music metadata explorer.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="glass-card p-6 rounded-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Real-time Data</h3>
          <p className="text-sm text-muted-foreground">
            Get live statistics from Spotify and YouTube including play counts and popularity scores
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Chart History</h3>
          <p className="text-sm text-muted-foreground">
            Explore chart positions and track performance across different music platforms
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Play className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Discover More</h3>
          <p className="text-sm text-muted-foreground">
            Find related songs, lyrics previews, and embedded players for instant listening
          </p>
        </div>
      </div>
    </div>
  );
};