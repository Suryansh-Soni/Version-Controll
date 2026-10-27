import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      if (!userId || userId === "undefined" || userId === "null") {
        console.error("User ID not found");
        setRepositories([]);
        return;
      }

      try {
        const response = await fetch(
          `http://13.233.26.77:3000/repo/user/${userId}`
        );

        if (!response.ok) {
          console.error(
            `Failed to fetch user repositories: ${response.status}`
          );
          setRepositories([]);
          return;
        }

        const data = await response.json();

        console.log("User repositories response:", data);

        const repos = Array.isArray(data)
          ? data
          : Array.isArray(data.repositories)
          ? data.repositories
          : [];

        setRepositories(repos);
      } catch (err) {
        console.error("Error while fetching repositories:", err);
        setRepositories([]);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(
          "http://13.233.26.77:3000/repo/all"
        );

        if (!response.ok) {
          console.error(
            `Failed to fetch suggested repositories: ${response.status}`
          );
          setSuggestedRepositories([]);
          return;
        }

        const data = await response.json();

        console.log("All repositories response:", data);

        const repos = Array.isArray(data)
          ? data
          : Array.isArray(data.repositories)
          ? data.repositories
          : [];

        setSuggestedRepositories(repos);
      } catch (err) {
        console.error(
          "Error while fetching suggested repositories:",
          err
        );
        setSuggestedRepositories([]);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (!Array.isArray(repositories)) {
      setSearchResults([]);
      return;
    }

    if (searchQuery.trim() === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />

      <section id="dashboard">
        <aside>
          <h3>Suggested Repositories</h3>

          {suggestedRepositories.length === 0 ? (
            <p>No repositories found.</p>
          ) : (
            suggestedRepositories.map((repo) => (
              <div key={repo._id}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))
          )}
        </aside>

        <main>
          <h2>Your Repositories</h2>

          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>

          {searchResults.length === 0 ? (
            <p>No repositories found.</p>
          ) : (
            searchResults.map((repo) => (
              <div key={repo._id}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))
          )}
        </main>

        <aside>
          <h3>Upcoming Events</h3>

          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>

            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>

            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;