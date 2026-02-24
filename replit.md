# PokéDex App - Original 151 Pokemon

A full-stack Pokemon application featuring the original Generation 1 Pokemon (1-151). Users can browse Pokemon, view detailed profiles, like/dislike Pokemon, and maintain a favorites collection.

## Features

- **Authentication**: Replit Auth integration with social logins (Google, GitHub, X, Apple, email/password)
- **Pokemon Browser**: View all 151 original Pokemon with images, types, and community stats
- **Voting System**: Like or dislike Pokemon, with real-time vote tracking
- **Favorites Collection**: Save favorite Pokemon to a personal collection
- **Detailed Profiles**: Click any Pokemon to view detailed information
- **Responsive Design**: Playful, vibrant UI matching Pokemon theme

## Tech Stack

### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Framer Motion for animations
- Shadcn UI components
- Tailwind CSS

### Backend
- Express server
- PostgreSQL database (Replit managed)
- Drizzle ORM
- Replit Auth (OpenID Connect)

## Database Schema

### Tables
- `users` - User accounts from Replit Auth
- `sessions` - Session storage for authentication
- `pokemon` - Pokemon data (151 entries with name, image, types, likes, dislikes)
- `favorites` - User's favorited Pokemon
- `user_votes` - Individual user votes (like/dislike) per Pokemon

## API Endpoints

- `GET /api/pokemon` - List all Pokemon with user's favorites/votes if authenticated
- `GET /api/pokemon/:id` - Get single Pokemon details
- `GET /api/favorites` - Get user's favorited Pokemon (auth required)
- `POST /api/favorites` - Toggle favorite status (auth required)
- `POST /api/votes` - Cast or change vote on Pokemon (auth required)

## Authentication Routes

- `/api/login` - Initiate Replit Auth login flow
- `/api/logout` - Log out and clear session
- `/api/auth/user` - Get current authenticated user

## Data Source

Pokemon data is automatically seeded from the [PokeAPI](https://pokeapi.co/) on first startup, fetching all 151 original Pokemon with their official artwork, types, and names.

## User Preferences

- Vibrant, playful design matching Pokemon aesthetic
- Community-driven voting system
- Personal favorites collection for authenticated users
