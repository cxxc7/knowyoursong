import { Loader2, Music } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <Music className="w-12 h-12 text-primary opacity-75" />
        </div>
        <Music className="w-12 h-12 text-primary relative z-10" />
      </div>
      
      <div className="mt-6 flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Searching for your song...</p>
      </div>
      
      <div className="flex gap-1 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-1 bg-wave-${i} music-wave rounded-full`}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};