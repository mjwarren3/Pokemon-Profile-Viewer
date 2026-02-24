import { usePokemonList } from "@/hooks/use-pokemon";
import { PokemonCard } from "@/components/PokemonCard";
import { LoadingScreen } from "@/components/ui/Loading";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { data: pokemonList, isLoading, error } = usePokemonList();
  const [search, setSearch] = useState("");

  if (isLoading) return <LoadingScreen />;
  if (error) return <div className="text-center mt-20 text-destructive font-bold">Failed to load Pokédex</div>;

  const filteredPokemon = pokemonList?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background bg-pokeball-pattern pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-black text-foreground mb-2">Kanto Region</h1>
            <p className="text-muted-foreground font-medium">Discover and vote on the original 151 Pokémon.</p>
          </div>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm"
            />
          </div>
        </div>

        {filteredPokemon.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">No Pokémon found</h3>
            <p className="text-muted-foreground">Try adjusting your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPokemon.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
