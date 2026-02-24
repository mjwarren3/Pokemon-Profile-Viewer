import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type PokemonResponse } from "@shared/schema";

// Types derived from schema
export type VoteRequest = { pokemonId: number; vote: number };
export type ToggleFavoriteRequest = { pokemonId: number };

export function usePokemonList() {
  return useQuery<PokemonResponse[]>({
    queryKey: ["/api/pokemon"],
    queryFn: async () => {
      const res = await fetch("/api/pokemon", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch pokemon");
      return res.json();
    },
  });
}

export function useFavorites() {
  return useQuery<PokemonResponse[]>({
    queryKey: ["/api/favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch favorites");
      return res.json();
    },
  });
}

export function usePokemon(id: number) {
  return useQuery<PokemonResponse>({
    queryKey: ["/api/pokemon", id],
    queryFn: async () => {
      const res = await fetch(`/api/pokemon/${id}`, { credentials: "include" });
      if (res.status === 404) throw new Error("Pokemon not found");
      if (!res.ok) throw new Error("Failed to fetch pokemon");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ToggleFavoriteRequest) => {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (res.status === 401) {
        window.location.href = "/api/login";
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to toggle favorite");
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pokemon"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pokemon", variables.pokemonId] });
      
      toast({
        title: data.isFavorite ? "Added to Favorites!" : "Removed from Favorites",
        description: data.isFavorite ? "This Pokémon is now in your favorites." : "This Pokémon was removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useVote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: VoteRequest) => {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (res.status === 401) {
        window.location.href = "/api/login";
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to submit vote");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pokemon"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pokemon", variables.pokemonId] });
    },
    onError: (error) => {
      toast({
        title: "Vote Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
