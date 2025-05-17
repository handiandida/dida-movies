import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import type { Category, Movie } from "../types";
import { fetchMovies } from "../api/tmbd";

interface Props {
  selectedCategory: Category;
  searchQuery: string;
}

const MovieList = ({ selectedCategory, searchQuery }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // This was missing usage before

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchMovies({
          category: selectedCategory,
          query: searchQuery,
          page,
        });
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [selectedCategory, searchQuery, page]);

  // Reset page to 1 when category or search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory]);

  const goToPage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 capitalize">
        {searchQuery
          ? `Search results for "${searchQuery}"`
          : selectedCategory.replace("_", " ")}
      </h2>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {!loading &&
          movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="relative group bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden"
            >
              {/* Wrap image and overlay */}
              <div className="relative">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                />
                {/* Overlay only on the image */}
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 text-white transition duration-300 ease-in-out flex items-center justify-center">
                  <h3 className="text-lg font-bold text-center">
                    Click for Details
                  </h3>
                </div>
              </div>

              {/* Keep title & release info visible */}
              <div className="p-4">
                <h3 className="text-lg font-bold">{movie.title}</h3>
                <p className="text-gray-600">
                  Release:{" "}
                  {movie.release_date
                    ? moment(movie.release_date).format("MMMM D, YYYY")
                    : "N/A"}
                </p>
              </div>
            </Link>
          ))}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50 text-white hover:bg-blue-300 transition cursor-pointer"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50 text-white hover:bg-blue-300 transition cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieList;
