import React, { useState } from "react";
import { useForums } from "../../contexts/ForumsContext";
import { useNavigate } from "react-router-dom";
import { useNews } from "../../contexts/NewsContext";
import "./CreateTopicView.css";

const CreateTopicPage = () => {
  const { createTopic } = useForums();
  const navigate = useNavigate();
  const { token } = useNews();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content.");
      return;
    }

    if (!token) {
      alert("You need to be logged in to create a topic.");
      return;
    }

    const newTopic = await createTopic({ title, content });

    if (newTopic) {
      navigate(`/forum/topic/${newTopic.id}`);
    } else {
      alert("Failed to create topic. Try again.");
    }
  };

  return (
    <div id="createTopicView">
      <div id="createTopicCard">
        <div id="createTopicHeader">
          <h2 id="createTopicTitle">Create a New Topic</h2>
          <p id="createTopicSubtitle">Start a discussion with a clear title and a thoughtful prompt.</p>
        </div>

        <form id="createTopicForm" onSubmit={(e) => handleSubmit(e)}>
          <div className="formField">
            <label className="formLabel" htmlFor="topicTitle">Title</label>
            <input
              id="topicTitle"
              className="textInput"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Thoughts on the latest policy changes?"
              aria-required="true"
            />
          </div>

          <div className="formField">
            <label className="formLabel" htmlFor="topicContent">Content</label>
            <textarea
              id="topicContent"
              className="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share context, sources, or a question to kick things off..."
              aria-required="true"
            />
          </div>

          <div className="formActions">
            <button type="submit" className="actionBtn saveBtn">Create Topic</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopicPage;
