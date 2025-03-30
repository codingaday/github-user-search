import { useState } from "react";
import githubService from "../services/githubService";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [minRepos, setMinRepos] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      searchTerm.trim() === "" &&
      location.trim() === "" &&
      minRepos.trim() === ""
    )
      return;

    setLoading(true);
    setError(null);
    setUsers([]);
    setPage(1);

    try {
      const userData = await githubService.fetchUserData(
        searchTerm,
        location,
        minRepos,
        1
      );
      setUsers(userData);
    } catch (err) {
      setError("Looks like we cant find the user");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const moreUsers = await githubService.fetchUserData(
        searchTerm,
        location,
        minRepos,
        nextPage
      );
      setUsers((prev) => [...prev, ...moreUsers]);
      setPage(nextPage);
    } catch (err) {
      setError("No more users to load");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            GitHub User Search
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:text-white transition"
            />
            <input
              type="text"
              placeholder="Location (e.g., San Francisco)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="p-3 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:text-white transition"
            />
            <input
              type="number"
              placeholder="Min Repos..."
              value={minRepos}
              onChange={(e) => setMinRepos(e.target.value)}
              min="0"
              className="p-3 border dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:text-white transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-md hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </button>
        </form>

        {/* Results */}
        <div className="mt-8 space-y-4">
          {loading && !users.length ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : users.length > 0 ? (
            <>
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center hover:shadow-lg transition transform hover:scale-102"
                >
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-16 h-16 rounded-full mr-4 border-2 border-blue-500"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {user.login}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Location: {user.location || "Not specified"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Repos: {user.public_repos || "N/A"}
                    </p>
                    <a
                      href={user.html_url}
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              ))}
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white p-3 rounded-md hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "Load More"
                )}
              </button>
            </>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No users yet—start searching!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
