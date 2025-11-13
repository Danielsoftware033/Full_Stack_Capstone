import React from 'react'
import {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import './UserForm.css'

const UserForm = ({ submitFunction, initialData, isUpdate = false }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    age: '',
    political_leaning: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submitFunction(formData)

  }

  return (
    <div id="signupView">
      <div id="signupCard">
        {!isUpdate && (
          <div id="signupHeader">
            <h2 id="signupTitle">Create Account</h2>
            <p id="signupSubtitle">Join us to get started with personalized news</p>
          </div>
        )}

        <form id="signupForm" onSubmit={(e) => handleSubmit(e)}>
          <div className="formRow">
            <div className="formField">
              <label className="formLabel" htmlFor="firstName">First Name</label>
              <input 
                id="firstName"
                className="textInput"
                type="text" 
                name="first_name" 
                placeholder="First name" 
                onChange={(e) => handleChange(e)} 
                value={formData.first_name}
                required 
              />
            </div>

            <div className="formField">
              <label className="formLabel" htmlFor="lastName">Last Name</label>
              <input 
                id="lastName"
                className="textInput"
                type="text" 
                name="last_name" 
                placeholder="Last name" 
                onChange={(e) => handleChange(e)} 
                value={formData.last_name}
                required 
              />
            </div>
          </div>

          <div className="formField">
            <label className="formLabel" htmlFor="username">Username</label>
            <input 
              id="username"
              className="textInput"
              type="text" 
              name="username" 
              placeholder="Choose a username" 
              onChange={(e) => handleChange(e)} 
              value={formData.username}
              required 
            />
          </div>

          <div className="formField">
            <label className="formLabel" htmlFor="email">Email</label>
            <input 
              id="email"
              className="textInput"
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              onChange={(e) => handleChange(e)} 
              value={formData.email}
              required 
            />
          </div>

          <div className="formField">
            <label className="formLabel" htmlFor="password">Password</label>
            <input 
              id="password"
              className="textInput"
              type="password" 
              name="password" 
              placeholder="Create a password" 
              onChange={(e) => handleChange(e)} 
              value={formData.password}
              required 
            />
          </div>

          <div className="formRow">
            <div className="formField">
              <label className="formLabel" htmlFor="age">Age</label>
              <input 
                id="age"
                className="textInput"
                type="number" 
                name="age" 
                placeholder="Age" 
                onChange={(e) => handleChange(e)} 
                value={formData.age}
                required 
              />
            </div>

            <div className="formField">
              <label className="formLabel" htmlFor="politicalLeaning">Political Leaning</label>
              <input 
                id="politicalLeaning"
                className="textInput"
                type="text" 
                name="political_leaning" 
                placeholder="e.g., Center, Left, Right" 
                onChange={(e) => handleChange(e)} 
                value={formData.political_leaning}
              />
            </div>
          </div>

          <div className="formActions">
            <button type="submit" className="actionBtn saveBtn">
              {isUpdate ? 'Update Profile' : 'Create Account'}
            </button>
          </div>
        </form>

        {!isUpdate && (
          <p className="loginPrompt">
            Already have an account? <Link to="/login" className="loginLink">Sign in here</Link>
          </p>
        )}
      </div>
    </div>
  )
}

export default UserForm
