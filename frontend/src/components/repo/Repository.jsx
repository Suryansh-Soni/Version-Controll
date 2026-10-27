import React, { useState } from "react";
import axios from "axios";
import { Button } from "@primer/react";
import { useNavigate } from "react-router-dom";
import "./repo.css";

const CreateRepository = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreateRepository = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Repository name is required");
      return;
    }

    const owner = localStorage.getItem("userId");

    if (!owner) {
      alert("User not found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://13.233.26.77:3000/repo/create",
        {
          owner: owner,
          name: name,
          description: description,
          content: [],
          issues: [],
          visibility: visibility,
        }
      );

      console.log("Repository created:", res.data);

      alert("Repository created successfully");

      navigate("/");
    } catch (err) {
      console.error("Repository creation failed:", err);

      alert(
        err.response?.data?.message ||
          "Repository creation failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-repo-wrapper">
      <div className="create-repo-container">

        <h1>Create a new repository</h1>

        <p className="repo-subtitle">
          A repository contains all project files, including the revision
          history.
        </p>

        <hr />

        <form onSubmit={handleCreateRepository}>

          <div className="repo-form-group">
            <label className="repo-label">
              Repository name
            </label>

            <input
              type="text"
              className="repo-input"
              placeholder="my-project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="repo-form-group">
            <label className="repo-label">
              Description (optional)
            </label>

            <input
              type="text"
              className="repo-input"
              placeholder="Description of your repository"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="off"
            />
          </div>

          <hr />

          <div className="visibility-section">

            <label className="visibility-option">
              <input
                type="radio"
                name="visibility"
                checked={visibility === true}
                onChange={() => setVisibility(true)}
              />

              <div>
                <strong>Public</strong>
                <p>Anyone can see this repository.</p>
              </div>
            </label>

            <label className="visibility-option">
              <input
                type="radio"
                name="visibility"
                checked={visibility === false}
                onChange={() => setVisibility(false)}
              />

              <div>
                <strong>Private</strong>
                <p>
                  You choose who can see and commit to this repository.
                </p>
              </div>
            </label>

          </div>

          <hr />

          <div className="create-btn-container">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading
                ? "Creating repository..."
                : "Create repository"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateRepository;