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

    const fetchTopNews = async (opts) => {
        // If opts provided, request specified per-bias counts; otherwise call endpoint
        // without params to trigger proportional mode on the server.
        let url = `${API_URL}/articles/homepage_balanced`;
        if (opts && (opts.left || opts.center || opts.right)) {
            const params = new URLSearchParams({
                left: String(opts.left || 5),
                center: String(opts.center || 5),
                right: String(opts.right || 5),
            });
            url = `${url}?${params.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Failed to fetch homepage articles', response.status);
            return;
        }

        const data = await response.json();
        setTopNews(data);
    };

    // admin-only refresh helper: triggers server-side refresh
    const refreshArticles = async (options = { target: 1000, per_page: 50 }) => {
        if (!token) {
            console.error('refreshArticles requires an auth token');
            return false;
        }

        const params = new URLSearchParams({
            target: String(options.target || 1000),
            per_page: String(options.per_page || 50)
        });

        const response = await fetch(`${API_URL}/articles/refresh?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            console.error('Failed to refresh articles', response.status);
            return false;
        }

        const result = await response.json();
        console.log('Refresh result:', result);
        return true;
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
                'Authorization': 'Bearer ' + token 
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
        refreshArticles,
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