import React, { createContext, useContext, useState, useEffect } from "react";
import { useNews } from './NewsContext'


// Creating the news context
const ForumsContext = createContext();

// Create hook to consume context (give access to context variables)
export const useForums = () => {
    const context = useContext(ForumsContext);
    return context;
}

const API_URL = "http://127.0.0.1:5000";

export const NewsProvider = ({ children }) => {
    const {token} = useNews();
    const [topics, setTopics] = useState([]);
    const [posts, setPosts] = useState({});


    const createTopic = async (topicData) => {
        const response = await fetch(API_URL+'/forum_topics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(topicData)
        });

        if (!response.ok) {
            console.error("Failed to create topic");
            return false;
        }

        const responseData = await response.json();
        const newTopic = responseData.topics; 
        setTopics(prev => [...prev, newTopic]);
        return newTopic;
    };


    const fetchTopics = async () => {
        const response = await fetch(API_URL+'/forum_topics', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            console.error('Failed to fetch topics');
            return false;
        }

        const data = await response.json();
        setTopics(data);
        return true;
    };


    const getTopic = async (topicId) => {
        const response = await fetch(`${API_URL}/forum_topics/${topicId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Failed to fetch topic');
            return false;
        }

        const data = await response.json();
        return data; 
    };


    const updateTopic = async (topicId, updateData) => {
        const response = await fetch(`${API_URL}/forum_topics/${topicId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            console.error('Failed to update topic');
            return false;
        }

        const data = await response.json();
        console.log(data)
        // copilot suggested in order to avoid keeping old topic in state
        setTopics(prev => prev.map(t => t.id === topicId ? data.topic : t));
        return true;
    };


    const deleteTopic = async (topicId) => {
        const response = await fetch(`${API_URL}/forum_topics/${topicId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            console.error('Failed to delete topic');
            return false;
        }

        const data = await response.json();
        setTopics(data.topics); 
        return true;
    }

    const searchTopics = async (title) => {
        const response = await fetch(`${API_URL}/forum_topics/search?title=${(title)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Failed to search topics');
            return false;
        }

        const data = await response.json();
        setTopics(data);  
        return true;
    };





    const createPost = async (postData) => {
        const response = await fetch(API_URL + '/forum_posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            console.error('Failed to create post');
            return false;
        }

        const data = await response.json();
        const newPost = data.posts; 
        setPosts(prev => [...prev, newPost]);
        return newPost;
    };


    const fetchPostsByTopic = async (topicId) => {
        const response = await fetch(`${API_URL}/forum_posts/topic/${topicId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            console.error('Failed to fetch posts');
            return false;
        }

        const data = await response.json();
        setPosts(data);
        return true;
    };


    const updatePost = async (postId, updateData) => {
        const response = await fetch(`${API_URL}/forum_posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            console.error('Failed to update post');
            return false;
        }

        const data = await response.json();
        console.log(data)
        setPosts(prev => prev.map(p => p.id === postId ? data.post : p));
        return true;
    };


    const deletePost = async (postId) => {
        const response = await fetch(`${API_URL}/forum_posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            console.error('Failed to delete post');
            return false;
        }
        //another way to delete
        const data = await response.json();
        setPosts(data.posts);
        return true;
    };


    const searchPosts = async (keyword) => {
        const response = await fetch(`${API_URL}/forum_posts/search?q=${keyword}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json' 
            }
        });

        if (!response.ok) {
            console.error('Failed to search posts');
            return false;
        }

        const data = await response.json();
        setPosts(data);
        return true;
    };

    const value = {
        topics,
        posts,
        createTopic,
        fetchTopics,
        getTopic,
        updateTopic,
        deleteTopic,
        searchTopics,
        createPost,
        fetchPostsByTopic,
        updatePost,
        deletePost,
        searchPosts
    };


    return (
        <ForumsContext.Provider value={value}>
            {children}
        </ForumsContext.Provider>
    )
}
