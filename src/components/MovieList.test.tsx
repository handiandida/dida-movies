import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MemoryRouter } from "react-router-dom";
import MovieList from "./MovieList";
import type { Category } from "../types";

const mockAxios = new MockAdapter(axios);

const fakeMoviesResponsePage1 = {
  results: [
    {
      id: 1,
      title: "Fake Movie 1",
      poster_path: "/fake1.jpg",
      release_date: "2025-01-01",
    },
    {
      id: 2,
      title: "Fake Movie 2",
      poster_path: "/fake2.jpg",
      release_date: "2025-02-01",
    },
  ],
  total_pages: 2,
};

const fakeMoviesResponsePage2 = {
  results: [
    {
      id: 3,
      title: "Fake Movie Page 2",
      poster_path: "/fake3.jpg",
      release_date: "2025-03-01",
    },
  ],
  total_pages: 2,
};

describe("MovieList Component", () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  test("renders loading initially and then movies", async () => {
    mockAxios.onGet(/page=1/).reply(200, fakeMoviesResponsePage1);

    render(
      <MemoryRouter>
        <MovieList selectedCategory={"popular" as Category} searchQuery="" />
      </MemoryRouter>
    );

    // Loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for movies to appear
    await waitFor(() => {
      expect(screen.getByText("Fake Movie 1")).toBeInTheDocument();
      expect(screen.getByText("Fake Movie 2")).toBeInTheDocument();
    });

    // Check pagination info
    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
  });

  test("pagination buttons enable/disable and navigation", async () => {
    // Mock page 1 response
    mockAxios.onGet(/page=1/).reply(200, fakeMoviesResponsePage1);

    // Mock page 2 response BEFORE clicking next
    mockAxios.onGet(/page=2/).reply(200, fakeMoviesResponsePage2);

    render(
      <MemoryRouter>
        <MovieList selectedCategory={"popular" as Category} searchQuery="" />
      </MemoryRouter>
    );

    // Wait for page 1 movies to load
    await waitFor(() => screen.getByText("Fake Movie 1"));

    const prevBtn = screen.getByText(/previous/i);
    const nextBtn = screen.getByText(/next/i);

    // Prev button disabled on first page, Next enabled
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeEnabled();

    // Click next button to go to page 2
    fireEvent.click(nextBtn);

    // Wait for page 2 movie to show up
    await waitFor(() =>
      expect(screen.getByText("Fake Movie Page 2")).toBeInTheDocument()
    );

    // Prev button should now be enabled
    expect(screen.getByText(/previous/i)).toBeEnabled();
  });

  test("shows search query in heading", async () => {
    mockAxios.onGet(/search\/movie/).reply(200, fakeMoviesResponsePage1);

    render(
      <MemoryRouter>
        <MovieList
          selectedCategory={"popular" as Category}
          searchQuery="batman"
        />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /search results for "batman"/i })
      ).toBeInTheDocument()
    );
  });

  test("resets page to 1 when category or searchQuery changes", async () => {
    // Mock page 1 and page 2 responses upfront
    mockAxios.onGet(/page=1/).reply(200, fakeMoviesResponsePage1);
    mockAxios.onGet(/page=2/).reply(200, fakeMoviesResponsePage2);

    const { rerender } = render(
      <MemoryRouter>
        <MovieList selectedCategory={"popular" as Category} searchQuery="" />
      </MemoryRouter>
    );

    // Wait for page 1 movies
    await waitFor(() => screen.getByText("Fake Movie 1"));

    // Go to page 2
    fireEvent.click(screen.getByText(/next/i));
    await waitFor(() =>
      expect(screen.getByText("Fake Movie Page 2")).toBeInTheDocument()
    );

    // Change search query - page should reset to 1
    mockAxios
      .onGet(/search\/movie\?query=newquery/)
      .reply(200, fakeMoviesResponsePage1);

    rerender(
      <MemoryRouter>
        <MovieList
          selectedCategory={"popular" as Category}
          searchQuery="newquery"
        />
      </MemoryRouter>
    );

    // Wait for reset results (page 1 movies) to appear
    await waitFor(() => screen.getByText("Fake Movie 1"));

    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
  });
});
