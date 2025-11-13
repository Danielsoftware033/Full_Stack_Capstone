import React, { useEffect } from 'react';
import { useNews } from '../../contexts/NewsContext';
import { useNavigate } from 'react-router-dom';
import './ProfileView.css';
import { useArticles } from '../../contexts/SavedArticlesContext';


const ProfileView = () => {
  const { user, deleteUser, logout, token } = useNews();
  const navigate = useNavigate();
  const { savedArticles, fetchSavedArticles } = useArticles();

  const handleDelete = () => {
      if (window.confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) {
        deleteUser();
        navigate('/');
      }
    }
  
  useEffect(() => {
    if (token) {
      fetchSavedArticles?.();
    }
  }, [token]);
  
  if (!user) {
    return (
      <div id="profileView">
        <div id="emptyState">
          <h2 id="emptyTitle">Profile</h2>
          <p id="emptyMessage">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const initials = `${(user.first_name?.[0] || user.username?.[0] || '').toUpperCase()}${(user.last_name?.[0] || '').toUpperCase()}`;    //copilot helped with this,
  //so that i can the initials of first and last name within a banner...

  return (
    <div id="profileView">
      <div id="profileContainer">
        <div id="profileBanner">
          <div id="bannerContent">
            <div id="avatarLarge">{initials || 'U'}</div>
            <div id="bannerInfo">
              <h1 id="userName">{user.username}</h1>
              <p id="userEmail">{user.email}</p>
            </div>
          </div>
          <div id="bannerActions">
            <button className="bannerBtn primaryBtn" onClick={() => navigate('/profile/update')}>
              Edit Profile
            </button>
            <button className="bannerBtn logoutBtn" onClick={() => { logout(); navigate('/'); }}>
              Logout
            </button>
          </div>
        </div>

        <div id="profileContent">
          <div id="mainColumn">
            <div className="infoCard">
              <div className="cardHeader">
                <h2 className="cardTitle">Personal Information</h2>
              </div>
              <div className="cardBody">
                <div className="infoGrid">
                  <div className="infoItem">
                    <span className="infoLabel">First Name</span>
                    <span className="infoValue">{user.first_name || 'Not provided'}</span>
                  </div>
                  <div className="infoItem">
                    <span className="infoLabel">Last Name</span>
                    <span className="infoValue">{user.last_name || 'Not provided'}</span>
                  </div>
                  <div className="infoItem">
                    <span className="infoLabel">Age</span>
                    <span className="infoValue">{user.age || 'Not provided'}</span>
                  </div>
                  <div className="infoItem">
                    <span className="infoLabel">Political Leaning</span>
                    <span className="infoValue">{user.political_leaning || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="infoCard">
              <div className="cardHeader">
                <h2 className="cardTitle">Account Settings</h2>
              </div>
              <div className="cardBody">
                <div className="settingItem">
                  <div className="settingInfo">
                    <div className="settingName">Email Address</div>
                    <div className="settingDescription">{user.email}</div>
                  </div>
                </div>
                <div className="settingItem">
                  <div className="settingInfo">
                    <div className="settingName">Username</div>
                    <div className="settingDescription">{user.username}</div>
                  </div>
                </div>
                <div className="settingItem dangerZone">
                  <div className="settingInfo">
                    <div className="settingName">Delete Account</div>
                    <div className="settingDescription">Permanently remove your account and all data</div>
                  </div>
                  <button className="dangerBtn" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div id="sideColumn">
            <div className="infoCard statsCard">
              <div className="cardHeader">
                <h2 className="cardTitle">Activity</h2>
              </div>
              <div className="cardBody">
                <div className="statItem">
                  <div className="statIcon">📰</div>
                  <div className="statDetails">
                    <div className="statValue">{savedArticles?.length}</div>
                    <div className="statName">Saved Articles</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default ProfileView;
