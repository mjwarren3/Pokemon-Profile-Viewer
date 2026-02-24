import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background bg-pokeball-pattern flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-rose-400 flex items-center justify-center shadow-xl animate-pulse">
          <div className="w-6 h-6 bg-white rounded-full border-4 border-primary/20" />
        </div>
        <Loader2 className="w-8 h-8 text-primary absolute -bottom-10 left-1/2 -translate-x-1/2 animate-spin" />
      </div>
      <h2 className="mt-16 text-xl font-display font-bold text-foreground animate-pulse">Loading Pokédex...</h2>
    </div>
  );
}
