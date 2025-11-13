import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForums } from "../../contexts/ForumsContext";
import { useNews } from "../../contexts/NewsContext";
import './TopicView.css';


const TopicPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();


  const { token, user } = useNews();
  const { getTopic, updateTopic, deleteTopic, fetchPostsByTopic, posts, createPost, updatePost, deletePost,} = useForums();


  const [topic, setTopic] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPostContent, setEditedPostContent] = useState("");
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editedTopicContent, setEditedTopicContent] = useState("")


  useEffect(() => {
    const fetchTopic = async () => {
      const data = await getTopic(topicId);
      setTopic(data);
      await fetchPostsByTopic(topicId);
    };
    fetchTopic();
  }, [topicId]);


  const handleSaveTopicEdit = async () => {
    const success = await updateTopic(topic.id, {
      title: topic.title,   
      content: editedTopicContent,
    });

    if (success) {
      const updated = await getTopic(topic.id);
      setTopic(updated);
      setIsEditingTopic(false);
    } else {
      alert("Failed to update topic.");
    }
  };



  const handleDeleteTopic = async () => {
    if (!token) {
      alert("You must be logged in to delete a topic.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this topic?");
    if (!confirmDelete) return;       //copilot suggested window.confirm for confirmation handling

    const success = await deleteTopic(topicId);
    if (success) {
      navigate("/forum");
    } else {
       alert("Failed to delete topic.");
    }
  };

  const handleCreatePost = async (e)=>{
    e.preventDefault()

    if (!token) {
      alert("You must be logged in to post.");
      return;
    }

    const newPost = await createPost({ content: newPostContent, topic_id: topicId }); //copilot suggestion, dont understand why topic_Id here
                                                              
    if (newPost) {  //but i think it's because topicposts model has a topic_Id field.
      setNewPostContent("");  
      await fetchPostsByTopic(topicId);
    } else {
      alert("Failed to create post.");
    }
  };


  const handleEditPost = (postId, content) => {
    console.log('start editing', postId, content);
    setEditingPostId(postId);
    setEditedPostContent(content);
  };

  
  const handleSavePost = async (postId) => {
    console.log('saving post', postId, editedPostContent);
    const success = await updatePost(postId, { 
      content: editedPostContent,
      topic_id: topic.id  
    });
    if (success) {
      setEditingPostId(null);
      setEditedPostContent("");
      await fetchPostsByTopic(topicId);
    } else {
      alert("Failed to update post.");
    }
  };



  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm("Delete this post?");
    if (!confirmDelete) return;   //copilot suggestion of window.confirm popup for confirmation handling

    const success = await deletePost(postId);
    if (!success) {
      alert("Failed to delete post.");
    }
  };


  return (
    <div id="topicView">

      {topic && (
        <div id="topicContainer">
          <div id="topicHeader">
            <h2 id="topicTitle">{topic.title}</h2>
            <div id="topicMeta">
              <span className="topicAuthor">{topic.user?.username || "Anonymous"}</span>
              <span className="topicDate">{new Date(topic.created_at).toLocaleString()}</span>
            </div>
          </div>

          <div id="topicBody">
            {isEditingTopic ? (
              <div id="editTopicForm">
                <textarea
                  className="topicTextarea"
                  value={editedTopicContent}
                  onChange={(e) => setEditedTopicContent(e.target.value)}
                />
                <div className="topicActions">
                  <button className="actionBtn saveBtn" onClick={handleSaveTopicEdit}>Save</button>
                  <button className="actionBtn secondaryBtn" onClick={() => setIsEditingTopic(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p id="topicContent">{topic.content}</p>

                {token && user?.id === topic.user?.id && (
                  <div className="topicActions">
                    <button
                      className="actionBtn"
                      onClick={() => {
                        setEditedTopicContent(topic.content);
                        setIsEditingTopic(true);
                      }}
                    >
                      Edit Topic
                    </button>
                    <button className="actionBtn dangerBtn" onClick={handleDeleteTopic}>Delete Topic</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div id="postsSection">
        <h3 id="postsTitle">Posts</h3>
        {posts.length > 0 ? (
          <div id="postsList">
            {posts.map((post) => (
              <div key={post.id ?? post._id} className="postCard">
                <div className="postMeta">
                  <span className="postAuthor">{post.user?.username || "Anonymous"}</span>
                  <span className="postDate">{new Date(post.created_at).toLocaleString()}</span>
                </div>

                {editingPostId === post.id ? (
                  <div className="editPostForm">
                    <textarea
                      className="postTextarea"
                      value={editedPostContent}
                      onChange={(e) => setEditedPostContent(e.target.value)}
                    />
                    <div className="postActions">
                      <button className="actionBtn saveBtn" onClick={() => handleSavePost(post.id)}>Save</button>
                      <button className="actionBtn secondaryBtn" onClick={() => setEditingPostId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="postContent">{post.content}</p>
                )}

                {token && user?.id === post.user?.id && (
                  <div className="postActions">
                    <button className="actionBtn" onClick={() => handleEditPost(post.id, post.content)}>Edit</button>
                    <button className="actionBtn dangerBtn" onClick={() => handleDeletePost(post.id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="noPosts">No posts yet.</p>
        )}
      </div>

      {token && (
        <form id="newPostForm" onSubmit={(e) => handleCreatePost(e)}>
          <textarea
            className="postTextarea"
            placeholder="Write your post here..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button type="submit" className="actionBtn saveBtn">Add Post</button>
        </form>
      )}
    </div>
  );
};

export default TopicPage;
