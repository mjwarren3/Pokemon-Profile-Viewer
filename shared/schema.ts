import { pgTable, text, integer, varchar, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const pokemon = pgTable("pokemon", {
  id: integer("id").primaryKey(), // 1 to 151
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  types: text("types").array().notNull(),
  likes: integer("likes").default(0).notNull(),
  dislikes: integer("dislikes").default(0).notNull(),
});

export const favorites = pgTable("favorites", {
  userId: varchar("user_id").notNull(),
  pokemonId: integer("pokemon_id").notNull(),
}, (t) => [primaryKey({ columns: [t.userId, t.pokemonId] })]);

export const userVotes = pgTable("user_votes", {
  userId: varchar("user_id").notNull(),
  pokemonId: integer("pokemon_id").notNull(),
  vote: integer("vote").notNull(), // 1 for like, -1 for dislike
}, (t) => [primaryKey({ columns: [t.userId, t.pokemonId] })]);

// Schemas
export const insertPokemonSchema = createInsertSchema(pokemon);
export type Pokemon = typeof pokemon.$inferSelect;
export type InsertPokemon = typeof pokemon.$inferInsert;

export type Favorite = typeof favorites.$inferSelect;
export type UserVote = typeof userVotes.$inferSelect;

export type PokemonResponse = Pokemon & {
  isFavorite?: boolean;
  userVote?: number; // 1, -1, or 0
};

export type ToggleFavoriteRequest = {
  pokemonId: number;
};

export type VoteRequest = {
  pokemonId: number;
  vote: number; // 1, -1, or 0 (remove vote)
};