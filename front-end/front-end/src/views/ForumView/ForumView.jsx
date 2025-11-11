import React, { useEffect, useState } from "react";
import { useForums } from "../../contexts/ForumsContext";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Forum</h1>

      <form onSubmit={(e) => handleSearch(e)}>
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <button onClick={() => navigate("/forum/create-topic")}>Create Topic</button>

      <div>
        {topics.length > 0 ? 
          topics.map((topic, idx)=>(
            <div key={idx}>
              <h3 onClick={() => navigate(`/forum/topic/${topic.id}`)} style={{cursor: 'pointer'}} >{topic.title}</h3>
              <p>                     
                {topic.user?.username || "Anonymous"} 
                {new Date(topic.created_at).toLocaleString()} 
              </p>
            </div>
          ))
         : (
          <p>No topics available.</p>
        )}
      </div>
    </div>
  );
};

export default ForumView;
