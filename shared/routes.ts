import { z } from 'zod';

export const errorSchemas = {
  unauthorized: z.object({ message: z.string() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  pokemon: {
    list: {
      method: 'GET' as const,
      path: '/api/pokemon' as const,
      responses: {
        200: z.array(z.custom<any>()), // Will cast to PokemonResponse[] in frontend
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/pokemon/:id' as const,
      responses: {
        200: z.custom<any>(),
        404: errorSchemas.notFound,
      }
    },
  },
  favorites: {
    list: {
      method: 'GET' as const,
      path: '/api/favorites' as const,
      responses: {
        200: z.array(z.custom<any>()),
        401: errorSchemas.unauthorized,
      }
    },
    toggle: {
      method: 'POST' as const,
      path: '/api/favorites' as const,
      input: z.object({ pokemonId: z.coerce.number() }),
      responses: {
        200: z.object({ isFavorite: z.boolean() }),
        401: errorSchemas.unauthorized,
      }
    }
  },
  votes: {
    cast: {
      method: 'POST' as const,
      path: '/api/votes' as const,
      input: z.object({ pokemonId: z.coerce.number(), vote: z.number() }),
      responses: {
        200: z.custom<any>(), // Returns updated pokemon stats
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
