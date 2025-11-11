import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForums } from "../../contexts/ForumsContext";
import { useNews } from "../../contexts/NewsContext";


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
      title: topic.title,   // make sure you have a state for the edited title
      content: editedTopicContent,
    });

    if (success) {
      // refresh topic to show updated content
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
      topic_id: topic.id  // include topic_id for the backend
    });
    if (success) {
      setEditingPostId(null);
      setEditedPostContent("");
      // refresh posts to make sure UI matches server state
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
    <div>

      {topic && (
        <div>
          <h2>{topic.title}</h2>
          {isEditingTopic ? (
          <div>
            <textarea
              value={editedTopicContent}
              onChange={(e) => setEditedTopicContent(e.target.value)}
            />
            <button onClick={handleSaveTopicEdit}>Save</button>
            <button onClick={() => setIsEditingTopic(false)}>Cancel</button>
          </div>
        ) : (
        <>
          <p>{topic.content}</p>
          <p>
            {topic.user?.username || "Anonymous"} |{" "}
            {new Date(topic.created_at).toLocaleString()}
          </p>

          {token && user?.id === topic.user?.id && (
            <div>
              <button onClick={() => {
                setEditedTopicContent(topic.content);
                setIsEditingTopic(true);
              }}>Edit Topic</button>
              <button onClick={handleDeleteTopic}>Delete Topic</button>
            </div>
          )}
        </>
      )}
        </div>
      )}


      <div>
        <h3>Posts</h3>
        {posts.length > 0 ? (
          posts.map((post, idx) => (
            <div key={post.id ?? post._id}>   
              <p>{post.user?.username || "Anonymous"}</p>

              {editingPostId === post.id ? (
                <div>
                  <textarea
                    value={editedPostContent}
                    onChange={(e) => setEditedPostContent(e.target.value)}
                    />
                  <button onClick={() => handleSavePost(post.id)}>Save</button>
                  <button onClick={() => setEditingPostId(null)}>Cancel</button>
                </div>
              ) : (
                <p>{post.content}</p>
              )}

              <p>{new Date(post.created_at).toLocaleString()}</p>


              {token && user?.id === post.user?.id && (
                <div>
                  <button onClick={() => handleEditPost(post.id, post.content)}>Edit</button>
                  <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>


      {token && (
        <form onSubmit={(e) => handleCreatePost(e)}>
          <textarea
            placeholder="Write your post here..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button type="submit">Add Post</button>
        </form>
      )}
    </div>
  );
};

export default TopicPage;
