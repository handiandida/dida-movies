import axios from "axios";
import type { Category, Movie } from "../types";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const searchMovies = async (query: string) => {
  if (!query) return { results: [] };
  const response = await tmdbApi.get("/search/movie", {
    params: { query },
  });
  return response.data;
};

export const fetchMovies = async ({
  category,
  query,
  page,
}: {
  category: string;
  query: string;
  page: number;
}) => {
  const url = query
    ? `/search/movie?query=${encodeURIComponent(query)}&page=${page}`
    : `/movie/${category}?page=${page}`;

  const response = await tmdbApi.get(url);
  return response.data;
};

export const fetchMovieDetails = async (id: string) => {
  const [movieRes, creditsRes] = await Promise.all([
    tmdbApi.get(`/movie/${id}`),
    tmdbApi.get(`/movie/${id}/credits`),
  ]);

  return {
    movie: movieRes.data,
    credits: creditsRes.data,
  };
};

export const fetchMoviesByCategory = async (category: Category) => {
  const response = await tmdbApi.get(`/movie/${category}`);
  return response.data.results as Movie[];
};
