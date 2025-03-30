import axios from "axios";

const API_URL = import.meta.env.VITE_APP_GITHUB_API_URL;
const SEARCH_USERS_ENDPOINT =
  `${API_URL}/search/users?q` || "https://api.github.com/search/users?q";

const fetchUserData = async (
  username = "",
  location = "",
  minRepos = "",
  page = 1
) => {
  try {
    let query = "";
    if (username) query += username;
    if (location) query += ` location:${location}`;
    if (minRepos) query += ` repos:>${minRepos}`;

    // Use SEARCH_USERS_ENDPOINT with params for query, page, and per_page
    const response = await axios.get(SEARCH_USERS_ENDPOINT, {
      params: {
        q: query.trim() || "type:user", // Default to all users if empty
        page,
        per_page: 10, // Limit to 10 per page
      },
    });

    return response.data.items; // Array of users
  } catch (error) {
    throw error;
  }
};

export default { fetchUserData };
