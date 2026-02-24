import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

const TYPE_COLORS: Record<string, string> = {
  grass: 'bg-[#78C850] text-white shadow-[#78C850]/40',
  fire: 'bg-[#F08030] text-white shadow-[#F08030]/40',
  water: 'bg-[#6890F0] text-white shadow-[#6890F0]/40',
  bug: 'bg-[#A8B820] text-white shadow-[#A8B820]/40',
  normal: 'bg-[#A8A878] text-white shadow-[#A8A878]/40',
  poison: 'bg-[#A040A0] text-white shadow-[#A040A0]/40',
  electric: 'bg-[#F8D030] text-black shadow-[#F8D030]/40',
  ground: 'bg-[#E0C068] text-black shadow-[#E0C068]/40',
  fairy: 'bg-[#EE99AC] text-black shadow-[#EE99AC]/40',
  fighting: 'bg-[#C03028] text-white shadow-[#C03028]/40',
  psychic: 'bg-[#F85888] text-white shadow-[#F85888]/40',
  rock: 'bg-[#B8A038] text-white shadow-[#B8A038]/40',
  ghost: 'bg-[#705898] text-white shadow-[#705898]/40',
  ice: 'bg-[#98D8D8] text-black shadow-[#98D8D8]/40',
  dragon: 'bg-[#7038F8] text-white shadow-[#7038F8]/40',
  dark: 'bg-[#705848] text-white shadow-[#705848]/40',
  steel: 'bg-[#B8B8D0] text-black shadow-[#B8B8D0]/40',
  flying: 'bg-[#A890F0] text-white shadow-[#A890F0]/40',
};

export function getTypeColor(type: string): string {
  const normalizedType = type.toLowerCase();
  return TYPE_COLORS[normalizedType] || 'bg-gray-400 text-white shadow-gray-400/40';
}
