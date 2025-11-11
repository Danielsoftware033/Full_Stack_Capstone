import React from "react";
import { useNavigate } from "react-router-dom";

const TopicCard = ({ topic }) => {
  const navigate = useNavigate();

  return (
    <div
      className="topic-card"
      onClick={() => navigate(`/topic/${topic.id}`)}
      style={{ cursor: "pointer" }}
    >
      <h3>{topic.title}</h3>
      <p>By: {topic.user_id.username}</p>
      <p>{new Date(topic.created_at).toLocaleString()}</p>
    </div>
  );
};

export default TopicCard;
