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
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null)

    // useEffect(() => {
    //     const savedToken = localStorage.getItem('token');
    //     const savedUser = localStorage.getItem('user');
    //     setToken(savedToken);
    //     const userData = JSON.parse(savedUser)
    //     setUser(userData);
    // },[]);


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
        setSearchResults(data);
    };


    const login = async (email, password) => {
        const response = await fetch(API_URL+'/users/login', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                email: email, 
                password: password 
            })
        });

        const loginData = await response.json(); 

        setToken(loginData.token); 
        setUser(loginData.user);   
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
    };

    
    const registerUser = async (registerData) => {
        const response = await fetch(API_URL+'/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        const responseData = await response.json()
        console.log(responseData)

        if (!response.ok){
            return false;
        }

        return true

        }
    




    const value = {
        topNews,
        searchResults,
        fetchTopNews,
        searchNews,
        login,
        registerUser,
        token,
        user
    }



    return (
        <NewsContext.Provider value={value}>
            {children}
        </NewsContext.Provider>
    )
}