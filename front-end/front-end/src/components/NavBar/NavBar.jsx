import React from 'react'
import { NavLink } from 'react-router-dom'
import { useNews } from '../../contexts/NewsContext'
import './NavBar.css'

const NavBar = () => {
  const { token } = useNews();
  return (
    <>
      <div id="navBar">
        <NavLink className={'navLink'} id="logo" to='/'>
          BiasTwin<span id="newsLabel">NEWS</span>
        </NavLink>

        <div id="navLinks">
          <NavLink className={'navLink'} to='/'>HOME</NavLink>
          <NavLink className={'navLink'} to='/search'>SEARCH</NavLink>
          <NavLink className={'navLink'} to='/forum'>FORUM</NavLink>
          <NavLink className={'navLink'} to='/saved'>SAVED</NavLink>
          <NavLink className={'navLink'} to='/login'>LOGIN</NavLink>
          <NavLink className={'navLink'} id="signupBtn" to='/signup'>SIGN UP</NavLink>
          {token && 
            <NavLink className={'navLink'} to='/profile'>PROFILE</NavLink>
          }
        </div>
      </div>
      <hr id="navDivider" />
    </>
  )
}

export default NavBar