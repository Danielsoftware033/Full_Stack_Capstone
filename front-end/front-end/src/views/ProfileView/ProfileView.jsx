import React from 'react';
import { useNews } from '../../contexts/NewsContext';
import { useNavigate } from 'react-router-dom';


const ProfileView = () => {
  const { user, deleteUser, logout } = useNews();
  const navigate = useNavigate();

  const handleDelete = () => {
      deleteUser();
      navigate('/');
    }
  

  return (
    <div>
      <h1>Profile Page</h1>
      <h2>{user.username}</h2>
      <hr />
      <div>
        <p>Email: {user.email}</p>
        <p>First Name: {user.first_name}</p>
        <p>Last Name: {user.last_name}</p>
        <p>Age: {user.age}</p>
        <p>Political Leaning: {user.political_leaning}</p>
        <button onClick={() => navigate('/profile/update')}>Update</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={() => {
          logout();
          navigate('/');
        }}>Logout</button>
      </div>
    </div>
  );
}


export default ProfileView;
