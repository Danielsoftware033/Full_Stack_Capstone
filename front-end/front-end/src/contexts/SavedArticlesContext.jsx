import React, { createContext, useContext, useState, useEffect } from "react";
import { useNews } from "./NewsContext";

const ArticlesContext = createContext();

export const useArticles = () => {
    const context = useContext(ArticlesContext);
    return context;
};

const API_URL = "http://127.0.0.1:5000";

export const ArticlesProvider = ({ children }) => {
    const { token } = useNews();

    const [articles, setArticles] = useState([]);
    const [savedArticles, setSavedArticles] = useState([]);


    useEffect(() => {
        if (!token) {
            setSavedArticles([]);
        }
    }, [token]);


    // const fetchArticles = async () => {
    //     const response = await fetch(`${API_URL}/articles/homepage`, {
    //         method: "GET",
    //         headers: { "Content-Type": "application/json" },
    //     });

    //     if (!response.ok) {
    //         console.error("Failed to fetch articles");
    //         return false;
    //     }

    //     const data = await response.json();
    //     setArticles(data);
    //     return true;
    // };


    const fetchSavedArticles = async () => {
        const response = await fetch(API_URL+'/articles', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch saved articles");
            return false;
        }

        const data = await response.json();
        setSavedArticles(data.saved_articles);
        return true;
    };


    const saveArticle = async (articleId) => {
        const response = await fetch(`${API_URL}/articles/add/${articleId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (!response.ok) {
            console.error("Failed to save article");
            return false;
        }

        const data = await response.json();
        setSavedArticles(data.saved_articles);
        return true;
    };


    const removeSavedArticle = async (articleId) => {
        const response = await fetch(`${API_URL}/articles/remove/${articleId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        if (!response.ok) {
            console.error("Failed to remove saved article");
            return false;
        }

        const data = await response.json();
        setSavedArticles(data.saved_articles);
        return true;
    };

    const value = {
        articles,
        savedArticles,
        // fetchArticles,
        fetchSavedArticles,
        saveArticle,
        removeSavedArticle,
        setSavedArticles
    };

    return (
        <ArticlesContext.Provider value={value}>
            {children}
        </ArticlesContext.Provider>
    );
};
