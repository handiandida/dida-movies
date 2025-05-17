import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import moment from "moment";
import type { Credits, CrewMember, Movie } from "../types";
import { fetchMovieDetails } from "../api/tmbd";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { movie, credits } = await fetchMovieDetails(id);
        setMovie(movie);
        setCredits(credits);
      } catch (err) {
        console.error("Failed to fetch movie details", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!movie || !credits)
    return <div className="p-6">No movie details found.</div>;

  const director = credits.crew.find(
    (person: CrewMember) => person.job === "Director"
  );
  const mainCast = credits.cast.slice(0, 5); // Top 5 cast

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image"
          }
          alt={movie.title}
          className="w-full md:w-1/3 rounded shadow"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-600 mb-2">
            Release Date: {moment(movie.release_date).format("MMMM D, YYYY")}
          </p>
          <p className="mb-4">{movie.overview}</p>

          <p className="font-semibold">
            Director: {director?.name || "Unknown"}
          </p>

          <h2 className="text-xl mt-4 mb-2 font-semibold">Main Cast</h2>
          <ul className="list-disc ml-6">
            {mainCast.map((actor) => (
              <li key={actor.id}>
                {actor.name} as {actor.character}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
