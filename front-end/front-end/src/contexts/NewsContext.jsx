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

    useEffect(() => {
        const savedToken = localStorage.getItem('token');  //used copilot to rewrite this, because previous version caused errors when localStorage had 'undefined' string
        const savedUser = localStorage.getItem('user');

        // used copilot: guard against stored string 'undefined' or missing keys
        setToken(savedToken && savedToken !== 'undefined' ? savedToken : null);

        let userData = null;
        if (savedUser && savedUser !== 'undefined') {
            try {
                userData = JSON.parse(savedUser);
            } catch (err) {
                // corrupt value in localStorage; clear it and continue
                console.error('Failed to parse saved user from localStorage:', err, savedUser);
                localStorage.removeItem('user');
                userData = null;
            }
        }

        setUser(userData);
    },[]);


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

        if (!response.ok){
            console.error('There was an issue logging in.')
            return false
        }

        const loginData = await response.json(); 
        console.log(loginData)

        setToken(loginData.token); 
        setUser(loginData.user);   
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        return true
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
    

    const updateUser = async (updateData) => {
        const response = await fetch(API_URL+'/users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token // make sure token is in your context
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            console.error("There was an issue updating.")
            return false
        }

        const updatedUserData = await response.json();
        console.log(updatedUserData)
        setUser(updatedUserData.user);
        localStorage.setItem('user', JSON.stringify(updatedUserData.user));
        return true;
    };


    const logout = () => {
        setToken('') 
        setUser('')
        localStorage.removeItem('token') 
        localStorage.removeItem('user')
    }


    const deleteUser = async () => {
        const response = await fetch(API_URL+'/users', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            console.error('Failed to delete user');
            return false;
        }

        const responseData = await response.json();
        console.log(responseData);

        logout(); 
        return true;
    };



    const value = {
        topNews,
        searchResults,
        fetchTopNews,
        searchNews,
        login,
        registerUser,
        updateUser,
        deleteUser,
        logout,
        token,
        user
    }



    return (
        <NewsContext.Provider value={value}>
            {children}
        </NewsContext.Provider>
    )
}