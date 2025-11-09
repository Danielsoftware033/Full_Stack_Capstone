import React, { createContext, useContext, useState, useEffect } from "react";
import { useNews } from './NewsContext'


// Creating the news context
const ForumContext = createContext();

// Create hook to consume context (give access to context variables)
export const useForums = () => {
    const context = useContext(ForumContext);
    return context;
}

const API_URL = "http://127.0.0.1:5000";

export const NewsProvider = ({ children }) => {
    const {token} = useNews();
    const [topics, setTopics] = useState([]);
    const [posts, setPosts] = useState({});