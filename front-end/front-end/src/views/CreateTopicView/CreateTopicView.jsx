import React, { useState } from "react";
import { useForums } from "../../contexts/ForumsContext";
import { useNavigate } from "react-router-dom";
import { useNews } from "../../contexts/NewsContext";

const CreateTopicPage = () => {
  const { createTopic } = useForums();
  const navigate = useNavigate();
  const { token } = useNews();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content.");  //copilot suggestion for alert popup window and error handling
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
    <div>
      <h2>Create a New Topic</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label>Title:</label><br/>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        <div>
          <label>Content:</label><br/>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
          />
        </div>
        <button type="submit">Create Topic</button>
      </form>
    </div>
  );
};

export default CreateTopicPage;
