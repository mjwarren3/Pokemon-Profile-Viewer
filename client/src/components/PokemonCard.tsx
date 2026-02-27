import { motion } from "framer-motion";
import { Link } from "wouter";
import { Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { type PokemonResponse } from "@shared/schema";
import { formatPokemonId, getTypeColor, cn } from "@/lib/pokemon-helpers";
import { useToggleFavorite, useVote } from "@/hooks/use-pokemon";
import { usePostHog } from "@posthog/react";
import mixpanel from "mixpanel-browser";

export function PokemonCard({ pokemon }: { pokemon: PokemonResponse }) {
  const toggleFavorite = useToggleFavorite();
  const vote = useVote();
  const posthog = usePostHog();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite.mutate({ pokemonId: pokemon.id });
    posthog?.capture("favorite_toggled", { pokemonId: pokemon.id });
    mixpanel.track("Favorited a Pokemon", { pokemonId: pokemon.id });
  };

  const handleVote = (e: React.MouseEvent, type: 1 | -1) => {
    e.preventDefault();
    // If clicking the same vote, remove it (0)
    const newVote = pokemon.userVote === type ? 0 : type;
    vote.mutate({ pokemonId: pokemon.id, vote: newVote });
    posthog?.capture("vote_cast", { pokemonId: pokemon.id, vote: newVote });
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-3xl p-5 shadow-sm shadow-black/5 border border-border hover:shadow-xl hover:shadow-black/10 hover:border-primary/20 transition-all duration-300 relative group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-muted-foreground font-mono font-bold text-sm bg-secondary px-2 py-1 rounded-lg">
          {formatPokemonId(pokemon.id)}
        </span>
        <button
          onClick={handleFavorite}
          disabled={toggleFavorite.isPending}
          className="p-2 -m-2 rounded-full hover:bg-rose-50 transition-colors z-10"
        >
          <Heart
            className={cn(
              "w-6 h-6 transition-all duration-300",
              pokemon.isFavorite
                ? "fill-rose-500 text-rose-500 scale-110"
                : "text-muted-foreground hover:text-rose-400",
            )}
          />
        </button>
      </div>

      <Link
        href={`/pokemon/${pokemon.id}`}
        className="block relative z-0 group-hover:scale-105 transition-transform duration-300"
      >
        <div className="flex justify-center my-6 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-secondary to-transparent rounded-full aspect-square scale-125 -z-10 opacity-50" />
          <img
            src={pokemon.imageUrl}
            alt={pokemon.name}
            className="w-32 h-32 object-contain drop-shadow-xl"
            loading="lazy"
          />
        </div>

        <h3 className="text-2xl font-display font-black capitalize text-center text-foreground mb-3 tracking-tight">
          {pokemon.name}
        </h3>

        <div className="flex justify-center gap-2 mb-6">
          {pokemon.types.map((t) => (
            <span
              key={t}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
                getTypeColor(t),
              )}
            >
              {t}
            </span>
          ))}
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-border pt-4 px-2">
        <button
          onClick={(e) => handleVote(e, 1)}
          disabled={vote.isPending}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
            pokemon.userVote === 1
              ? "bg-emerald-50 text-emerald-600"
              : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-600",
          )}
        >
          <ThumbsUp
            className={cn(
              "w-5 h-5",
              pokemon.userVote === 1 && "fill-emerald-600",
            )}
          />
          <span className="font-bold text-sm">{pokemon.likes}</span>
        </button>

        <button
          onClick={(e) => handleVote(e, -1)}
          disabled={vote.isPending}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
            pokemon.userVote === -1
              ? "bg-rose-50 text-rose-600"
              : "text-muted-foreground hover:bg-rose-50 hover:text-rose-600",
          )}
        >
          <ThumbsDown
            className={cn(
              "w-5 h-5",
              pokemon.userVote === -1 && "fill-rose-600",
            )}
          />
          <span className="font-bold text-sm">{pokemon.dislikes}</span>
        </button>
      </div>
    </motion.div>
  );
}
