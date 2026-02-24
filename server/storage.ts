import { db } from "./db";
import { pokemon, favorites, userVotes, type PokemonResponse, type InsertPokemon } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  getPokemonList(userId?: string): Promise<PokemonResponse[]>;
  getPokemon(id: number, userId?: string): Promise<PokemonResponse | undefined>;
  getFavorites(userId: string): Promise<PokemonResponse[]>;
  toggleFavorite(userId: string, pokemonId: number): Promise<boolean>;
  castVote(userId: string, pokemonId: number, vote: number): Promise<PokemonResponse>;
  seedPokemon(pokemonData: InsertPokemon[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getPokemonList(userId?: string): Promise<PokemonResponse[]> {
    const list = await db.select().from(pokemon).orderBy(pokemon.id);
    
    if (!userId) {
      return list.map(p => ({ ...p, isFavorite: false, userVote: 0 }));
    }
    
    const userFavorites = await db.select().from(favorites).where(eq(favorites.userId, userId));
    const votes = await db.select().from(userVotes).where(eq(userVotes.userId, userId));
    
    const favSet = new Set(userFavorites.map(f => f.pokemonId));
    const voteMap = new Map(votes.map(v => [v.pokemonId, v.vote]));
    
    return list.map(p => ({
      ...p,
      isFavorite: favSet.has(p.id),
      userVote: voteMap.get(p.id) || 0
    }));
  }

  async getPokemon(id: number, userId?: string): Promise<PokemonResponse | undefined> {
    const [p] = await db.select().from(pokemon).where(eq(pokemon.id, id));
    if (!p) return undefined;
    
    if (!userId) {
      return { ...p, isFavorite: false, userVote: 0 };
    }
    
    const [fav] = await db.select().from(favorites).where(and(eq(favorites.userId, userId), eq(favorites.pokemonId, id)));
    const [v] = await db.select().from(userVotes).where(and(eq(userVotes.userId, userId), eq(userVotes.pokemonId, id)));
    
    return {
      ...p,
      isFavorite: !!fav,
      userVote: v ? v.vote : 0
    };
  }

  async getFavorites(userId: string): Promise<PokemonResponse[]> {
    const userFavorites = await db.select().from(favorites).where(eq(favorites.userId, userId));
    if (userFavorites.length === 0) return [];
    
    const favIds = userFavorites.map(f => f.pokemonId);
    
    // We can just fetch the whole list and filter
    const list = await this.getPokemonList(userId);
    return list.filter(p => p.isFavorite);
  }

  async toggleFavorite(userId: string, pokemonId: number): Promise<boolean> {
    const existing = await db.select().from(favorites).where(and(eq(favorites.userId, userId), eq(favorites.pokemonId, pokemonId)));
    
    if (existing.length > 0) {
      await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.pokemonId, pokemonId)));
      return false;
    } else {
      await db.insert(favorites).values({ userId, pokemonId });
      return true;
    }
  }

  async castVote(userId: string, pokemonId: number, vote: number): Promise<PokemonResponse> {
    // Get existing vote
    const [existing] = await db.select().from(userVotes).where(and(eq(userVotes.userId, userId), eq(userVotes.pokemonId, pokemonId)));
    
    const currentVote = existing ? existing.vote : 0;
    
    // Calculate deltas
    let likesDelta = 0;
    let dislikesDelta = 0;
    
    if (currentVote === 1) likesDelta -= 1;
    if (currentVote === -1) dislikesDelta -= 1;
    
    if (vote === 1) likesDelta += 1;
    if (vote === -1) dislikesDelta += 1;
    
    // Execute updates in transaction
    await db.transaction(async (tx) => {
      // Update vote record
      if (vote === 0) {
        if (existing) {
          await tx.delete(userVotes).where(and(eq(userVotes.userId, userId), eq(userVotes.pokemonId, pokemonId)));
        }
      } else {
        await tx.insert(userVotes)
          .values({ userId, pokemonId, vote })
          .onConflictDoUpdate({
            target: [userVotes.userId, userVotes.pokemonId],
            set: { vote }
          });
      }
      
      // Update stats
      if (likesDelta !== 0 || dislikesDelta !== 0) {
        await tx.update(pokemon)
          .set({
            likes: sql`likes + ${likesDelta}`,
            dislikes: sql`dislikes + ${dislikesDelta}`
          })
          .where(eq(pokemon.id, pokemonId));
      }
    });
    
    return (await this.getPokemon(pokemonId, userId))!;
  }

  async seedPokemon(pokemonData: InsertPokemon[]): Promise<void> {
    const existing = await db.select().from(pokemon).limit(1);
    if (existing.length === 0) {
      // Chunk insertions due to parameter limits in postgres if needed, but 151 rows is small enough.
      await db.insert(pokemon).values(pokemonData);
    }
  }
}

export const storage = new DatabaseStorage();
