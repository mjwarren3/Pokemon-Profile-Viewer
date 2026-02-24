import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up auth
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.pokemon.list.path, async (req, res) => {
    const userId = req.isAuthenticated() ? (req.user as any).claims?.sub : undefined;
    const pokemonList = await storage.getPokemonList(userId);
    res.json(pokemonList);
  });

  app.get(api.pokemon.get.path, async (req, res) => {
    const userId = req.isAuthenticated() ? (req.user as any).claims?.sub : undefined;
    const pokemon = await storage.getPokemon(Number(req.params.id), userId);
    
    if (!pokemon) {
      return res.status(404).json({ message: "Pokemon not found" });
    }
    
    res.json(pokemon);
  });

  app.get(api.favorites.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const favorites = await storage.getFavorites(userId);
    res.json(favorites);
  });

  app.post(api.favorites.toggle.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.favorites.toggle.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      
      const isFavorite = await storage.toggleFavorite(userId, input.pokemonId);
      res.json({ isFavorite });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.votes.cast.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.votes.cast.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      
      // Ensure pokemon exists
      const p = await storage.getPokemon(input.pokemonId);
      if (!p) {
        return res.status(404).json({ message: "Pokemon not found" });
      }
      
      const updatedPokemon = await storage.castVote(userId, input.pokemonId, input.vote);
      res.json(updatedPokemon);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Seed pokemon on startup
  seedPokemonDatabase().catch(console.error);

  return httpServer;
}

async function seedPokemonDatabase() {
  const existing = await storage.getPokemonList();
  if (existing.length === 0) {
    console.log("Seeding pokemon database...");
    
    try {
      const { InsertPokemon } = await import("@shared/schema");
      const pokemonData: typeof InsertPokemon[] = [];
      
      // Fetch 151 pokemon from pokeapi
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data = await res.json();
      
      for (let i = 0; i < data.results.length; i++) {
        const pRes = await fetch(data.results[i].url);
        const pData = await pRes.json();
        
        pokemonData.push({
          id: pData.id,
          name: pData.name.charAt(0).toUpperCase() + pData.name.slice(1),
          imageUrl: pData.sprites.other["official-artwork"].front_default || pData.sprites.front_default,
          types: pData.types.map((t: any) => t.type.name),
          likes: 0,
          dislikes: 0,
        });
      }
      
      await storage.seedPokemon(pokemonData);
      console.log("Seeded 151 Pokemon successfully!");
    } catch (error) {
      console.error("Failed to seed pokemon database:", error);
    }
  }
}
