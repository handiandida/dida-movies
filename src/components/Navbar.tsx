import { useState, type FormEvent } from "react";
import type { Category } from "../types";
import { Link } from "react-router-dom";

interface NavbarProps {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  onSearch: (query: string) => void;
}

const Navbar = ({
  selectedCategory,
  setSelectedCategory,
  onSearch,
}: NavbarProps) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchInput.trim());
  };

  const categories: { label: string; key: Category }[] = [
    { label: "Now Playing", key: "now_playing" },
    { label: "Popular", key: "popular" },
    { label: "Top Rated", key: "top_rated" },
    { label: "Upcoming", key: "upcoming" },
  ];

  return (
    <nav className="bg-blue-600 text-white px-4 py-4 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <Link
        to="/"
        onClick={() => {
          setSelectedCategory("now_playing");
          onSearch(""); // Clear search
          setSearchInput("");
        }}
        className="text-2xl font-bold hover:text-gray-200 cursor-pointer"
      >
        🎬 Movie Explorer
      </Link>

      {/* Category Buttons */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setSelectedCategory(cat.key);
              onSearch(""); // clear search
              setSearchInput("");
            }}
            className={`px-3 py-1 rounded transition cursor-pointer ${
              selectedCategory === cat.key
                ? "bg-white text-blue-600"
                : "bg-blue-500 hover:bg-blue-400"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Field */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search movies..."
          className="px-3 py-1 rounded text-black bg-white"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-white text-blue-600 px-3 py-1 rounded cursor-pointer"
        >
          Search
        </button>
      </form>
    </nav>
  );
};

export default Navbar;
