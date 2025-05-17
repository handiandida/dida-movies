import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MovieList from "./components/MovieList";
import MovieDetail from "./components/MovieDetail";
import type { Category } from "./types";
import "./App.css";

const App = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("now_playing");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <Navbar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSearch={setSearchQuery}
      />

      <Routes>
        <Route
          path="/"
          element={
            <MovieList
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          }
        />
        <Route path="/movies/:id" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
