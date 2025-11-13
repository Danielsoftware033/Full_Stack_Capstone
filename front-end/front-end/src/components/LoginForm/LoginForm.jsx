import React, { useState } from 'react';
import { useNews } from '../../contexts/NewsContext';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess]= useState(true)
  const { login } = useNews();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    let loggedin = await login(email, password);
    if (loggedin) {
        navigate('/')
    }
    setSuccess(loggedin)   //*personal note: the loggedin has either true or false 
  }; 


  return (
    <div id="loginView">
      <div id="loginCard">
        <div id="loginHeader">
          <h2 id="loginTitle">Welcome Back</h2>
          <p id="loginSubtitle">Sign in to your account to continue</p>
        </div>

        <form id="loginForm" onSubmit={(e)=>handleSubmit(e)}>
          <div className="formField">
            <label className="formLabel" htmlFor="loginEmail">Email</label>
            <input 
              id="loginEmail"
              className="textInput"
              value={email} 
              type="email" 
              placeholder="Enter your email" 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="formField">
            <label className="formLabel" htmlFor="loginPassword">Password</label>
            <input 
              id="loginPassword"
              className="textInput"
              value={password} 
              type="password" 
              placeholder="Enter your password" 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!success && <p className="errorMessage">Invalid email or password</p>}

          <div className="formActions">
            <button type="submit" className="actionBtn saveBtn">Sign In</button>
          </div>
        </form>

        <p className="signupPrompt">
          Don't have an account? <Link to="/signup" className="signupLink">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
