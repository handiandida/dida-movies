import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import moment from "moment";
import type { Movie } from "../types";
import { searchMovies } from "../api/tmbd";

const MovieSearch = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await searchMovies(query);
        setResults(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">
        Search results for: <span className="text-blue-600">{query}</span>
      </h1>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results.map((movie) => (
          <Link
            to={`/movies/${movie.id}`}
            key={movie.id}
            className="bg-white shadow rounded hover:shadow-lg overflow-hidden"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movie.title}
              className="w-full h-72 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold">{movie.title}</h2>
              <p className="text-gray-600">
                Release:{" "}
                {movie.release_date
                  ? moment(movie.release_date).format("MMMM D, YYYY")
                  : "Unknown"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {!loading && results.length === 0 && query && (
        <p className="text-center mt-10 text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default MovieSearch;
