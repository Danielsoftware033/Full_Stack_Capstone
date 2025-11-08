import React, { createContext, useContext, useState, useEffect } from "react";


// Creating the news context
const NewsContext = createContext();

// Create hook to consume context (give access to context variables)
export const useNews = () => {
    const context = useContext(NewsContext);
    return context;
}




const API_URL = "http://127.0.0.1:5000";

export const NewsProvider = ({ children }) => {
    const [topNews, setTopNews] = useState([]); 
    const [searchResults, setSearchResults] = useState([]); 


//     useEffect(() => {
//     const fetchTopNews = async () => {
//         const response = await fetch(API_URL+'/articles/fetch', {    //get all the news articles for homepage
//             method: 'GET', 
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         const data = await response.json();
//         setTopNews(data); 
//     };

//     fetchTopNews();
// }, []);

    const fetchTopNews = async () => {
        const response = await fetch(API_URL+'/articles/fetch', {    //get all the news articles for homepage
            method: 'GET', 
            headers: {                                              //i tried putting this function in a useEffect, then exporting it to HomeView, but it didnt work
                'Content-Type': 'application/json'                  //i had to call the useEffect instead on HomeView
            }
        });

        const data = await response.json();
        // console.log("TOP NEWS RESPONSE:", data); 
        setTopNews(data); 
    };


    const searchNews = async (keyword) => {
        const response = await fetch(`${API_URL}/articles/search?q=${keyword}`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        // console.log("SEARCH RESULTS:", data);
        setSearchResults(data);
    };



    const registerUser = async (registerData) => {
        const response = await fetch(API_URL+'/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })

        const responseData = await response.json()
        console.log(responseData)
    };





    const value = {
        topNews,
        searchResults,
        fetchTopNews,
        searchNews,
        registerUser
    }

    return (
        <NewsContext.Provider value={value}>
            {children}
        </NewsContext.Provider>
    )
}