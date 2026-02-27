import { useFavorites } from "@/hooks/use-pokemon";
import { PokemonCard } from "@/components/PokemonCard";
import { LoadingScreen } from "@/components/ui/Loading";
import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function Favorites() {
  const { data: favorites, isLoading, error } = useFavorites();

  if (isLoading) return <LoadingScreen />;
  if (error)
    return (
      <div className="text-center mt-20 text-destructive font-bold">
        Failed to load Favorites
      </div>
    );

  return (
    <div className="min-h-screen bg-background bg-pokeball-pattern pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-black text-foreground mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            Your Favorites (TEST)
          </h1>
          <p className="text-muted-foreground font-medium">
            Your personally curated dream team.
          </p>
        </div>

        {!favorites || favorites.length === 0 ? (
          <div className="text-center py-32 bg-card rounded-3xl border border-border shadow-sm">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-rose-300" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-3">
              No favorites yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't added any Pokémon to your favorites. Explore the
              Pokédex and click the heart icon to save them here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
            >
              Browse Pokédex
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
