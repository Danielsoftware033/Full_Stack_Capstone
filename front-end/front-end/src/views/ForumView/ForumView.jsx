import React, { useEffect, useState } from "react";
import { useForums } from "../../contexts/ForumsContext";
import { useNavigate } from "react-router-dom";
import './ForumView.css';

const ForumView = () => {
  const { topics, fetchTopics, searchTopics } = useForums();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  // const handleSearch = async (e) => {
  //   e.preventDefault();

  //   if (searchTerm.trim() === "") {  //unnecessary conditional, an empty string still returns the full list of topics anyways but good learning note (copilot)
  //     await fetchTopics();
  //   } else {
  //     await searchTopics(searchTerm);
  //   }
  // }

  const handleSearch = async (e) => {
    e.preventDefault();
    await searchTopics(searchTerm);
  };


  return (
    <div id="forumView">
      <div id="forumHeader">
        <h1 id="forumTitle">Community Forum</h1>
        <p id="forumSubtitle">Join the discussion on current events and perspectives</p>
      </div>

      <div id="forumControls">
        <form id="forumSearchForm" onSubmit={(e) => handleSearch(e)}>
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="forumSearchInput"
          />
          <button type="submit" className="forumSearchBtn">Search</button>
        </form>
        <button 
          onClick={() => navigate("/forum/create-topic")} 
          id="createTopicBtn"
        >
          Create Topic
        </button>
      </div>

      <div id="topicsList">
        {topics.length > 0 ? 
          topics.map((topic, idx)=>(
            <div key={idx} className="topicCard" onClick={() => navigate(`/forum/topic/${topic.id}`)}>
              <h3 className="topicTitle">{topic.title}</h3>
              <div className="topicMeta">
                <span className="topicAuthor">{topic.user?.username || "Anonymous"}</span>
                <span className="topicDate">{new Date(topic.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))
         : (
          <p className="noTopics">No topics available.</p>
        )}
      </div>
    </div>
  );
};

export default ForumView;
