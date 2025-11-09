import React, { useState } from 'react';
import { useNews } from '../../contexts/NewsContext';
import { useNavigate, Link } from 'react-router-dom';


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
    <div>
      <form onSubmit={(e)=>handleSubmit(e)}>
        <input value={email} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
        <input value={password} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit">Submit</button>
      </form>
      <p>Don't have an account? <Link to="/signup">sign-up here</Link></p>
      {/* {!success && <p>Invalid email or password</p>} */}
    </div>
  );
};

export default LoginForm;
