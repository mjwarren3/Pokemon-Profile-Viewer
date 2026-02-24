import { useRoute, Link } from "wouter";
import { usePokemon, useToggleFavorite, useVote } from "@/hooks/use-pokemon";
import { LoadingScreen } from "@/components/ui/Loading";
import { formatPokemonId, getTypeColor, cn } from "@/lib/pokemon-helpers";
import { Heart, ThumbsUp, ThumbsDown, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const [, params] = useRoute("/pokemon/:id");
  const pokemonId = Number(params?.id);
  
  const { data: pokemon, isLoading, error } = usePokemon(pokemonId);
  const toggleFavorite = useToggleFavorite();
  const vote = useVote();

  if (isLoading) return <LoadingScreen />;
  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Pokémon not found</h2>
        <Link href="/" className="text-primary hover:underline font-bold">Return to Pokédex</Link>
      </div>
    );
  }

  const handleFavorite = () => {
    toggleFavorite.mutate({ pokemonId: pokemon.id });
  };

  const handleVote = (type: 1 | -1) => {
    const newVote = pokemon.userVote === type ? 0 : type;
    vote.mutate({ pokemonId: pokemon.id, vote: newVote });
  };

  // Use the primary type color for ambient backgrounds
  const mainTypeColorClass = getTypeColor(pokemon.types[0]);

  return (
    <div className="min-h-screen bg-background bg-pokeball-pattern pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Pokédex
        </Link>

        <div className="bg-card rounded-[2.5rem] shadow-xl shadow-black/5 border border-border overflow-hidden">
          {/* Header Area */}
          <div className="relative pt-12 pb-8 px-8 sm:px-16 text-center border-b border-border bg-gradient-to-b from-secondary/50 to-transparent">
            
            <div className="absolute top-8 right-8">
              <button 
                onClick={handleFavorite}
                disabled={toggleFavorite.isPending}
                className="p-4 bg-white shadow-md rounded-full hover:scale-110 transition-transform"
              >
                <Heart 
                  className={cn(
                    "w-8 h-8 transition-colors", 
                    pokemon.isFavorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
                  )} 
                />
              </button>
            </div>

            <div className="absolute top-8 left-8">
              <span className="font-mono font-black text-2xl text-muted-foreground/50">
                {formatPokemonId(pokemon.id)}
              </span>
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative inline-block mb-8"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-full scale-150 blur-3xl -z-10" />
              <img 
                src={pokemon.imageUrl} 
                alt={pokemon.name} 
                className="w-64 h-64 sm:w-80 sm:h-80 object-contain drop-shadow-2xl mx-auto relative z-10"
              />
            </motion.div>

            <h1 className="text-5xl sm:text-6xl font-display font-black capitalize text-foreground mb-6 tracking-tight">
              {pokemon.name}
            </h1>

            <div className="flex justify-center gap-3">
              {pokemon.types.map(t => (
                <span 
                  key={t}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest shadow-md",
                    getTypeColor(t)
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Stats & Actions Area */}
          <div className="p-8 sm:p-16 bg-white">
            <h3 className="text-xl font-bold text-center text-muted-foreground mb-8 uppercase tracking-widest">Community Rating</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
              <button 
                onClick={() => handleVote(1)}
                disabled={vote.isPending}
                className={cn(
                  "flex items-center gap-4 px-8 py-6 rounded-3xl w-full sm:w-auto justify-center transition-all duration-300 border-2",
                  pokemon.userVote === 1 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-lg shadow-emerald-500/20 scale-105" 
                    : "bg-card border-border text-muted-foreground hover:border-emerald-500/50 hover:bg-emerald-50 hover:text-emerald-600"
                )}
              >
                <ThumbsUp className={cn("w-8 h-8", pokemon.userVote === 1 && "fill-emerald-600")} /> 
                <div className="text-left">
                  <div className="text-sm font-bold opacity-70 uppercase tracking-wider">Likes</div>
                  <div className="text-3xl font-black">{pokemon.likes}</div>
                </div>
              </button>
              
              <button 
                onClick={() => handleVote(-1)}
                disabled={vote.isPending}
                className={cn(
                  "flex items-center gap-4 px-8 py-6 rounded-3xl w-full sm:w-auto justify-center transition-all duration-300 border-2",
                  pokemon.userVote === -1 
                    ? "bg-rose-50 border-rose-500 text-rose-600 shadow-lg shadow-rose-500/20 scale-105" 
                    : "bg-card border-border text-muted-foreground hover:border-rose-500/50 hover:bg-rose-50 hover:text-rose-600"
                )}
              >
                <ThumbsDown className={cn("w-8 h-8", pokemon.userVote === -1 && "fill-rose-600")} /> 
                <div className="text-left">
                  <div className="text-sm font-bold opacity-70 uppercase tracking-wider">Dislikes</div>
                  <div className="text-3xl font-black">{pokemon.dislikes}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
