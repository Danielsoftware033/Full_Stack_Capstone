import React from 'react'
import { NavLink } from 'react-router-dom'
// import { useAuth } from '../../contexts/AuthContext'

// const NavBar = () => {
//   const { token } = useAuth() 

//   return (
//     <header>
//       <h1>BiasTwin</h1>
//       <nav>
//         <ul>
//           <li>
//             <NavLink to="/">HOME</NavLink>
//           </li>
//           <li>
//             <NavLink to="/search">SEARCH</NavLink>
//           </li>
//           <li>
//             <NavLink to="/forum">FORUM</NavLink>
//           </li>
//           {!token && (
//             <>
//               <li>
//                 <NavLink to="/login">LOGIN</NavLink>
//               </li>
//               <li>
//                 <NavLink to="/signup">SIGN UP</NavLink>
//               </li>
//             </>
//           )}
//           {token && (
//             <li>
//               <NavLink to="/saved">SAVED</NavLink>
//             </li>
//           )}
//         </ul>
//       </nav>
//     </header>
//   )
// }

// export default NavBar


// const NavBar = () => {
//   return (
//     <header>
//       <h1>BiasTwin</h1>
//       <nav>
//         <ul>
//           <li>
//             <NavLink to="/">HOME</NavLink>
//           </li>
//           <li>
//             <NavLink to="/search">SEARCH</NavLink>
//           </li>
//           <li>
//             <NavLink to="/forum">FORUM</NavLink>
//           </li>
//           <li>
//             <NavLink to="/login">LOGIN</NavLink>
//           </li>
//           <li>
//             <NavLink to="/signup">SIGN UP</NavLink>
//           </li>
//           <li>
//             <NavLink to="/saved">SAVED</NavLink>
//           </li>
//         </ul>
//       </nav>
//     </header>
//   );
// };

// export default NavBar;


const NavBar = () => {
  return (
    <header style={{ 
      backgroundColor: "#6b3131ff", 
      color: "white", 
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <h1 style={{ margin: 0 }}>BiasTwin</h1>

      <nav>
        <ul style={{ 
          listStyle: "none", 
          display: "flex", 
          gap: "20px", 
          margin: 0, 
          padding: 0 
        }}>
          <li><NavLink style={{ color: "white", textDecoration: "none" }} to="/">HOME</NavLink></li>
          <li><NavLink style={{ color: "white", textDecoration: "none" }} to="/search">SEARCH</NavLink></li>
          <li><NavLink style={{ color: "white", textDecoration: "none" }} to="/forum">FORUM</NavLink></li>
          <li><NavLink style={{ color: "white", textDecoration: "none" }} to="/saved">SAVED</NavLink></li>
          <li><NavLink style={{ color: "white", textDecoration: "none" }} to="/login">LOGIN</NavLink></li>
          <li><NavLink style={{ color: "white", textDecoration: "none" }} to="/signup">SIGN UP</NavLink></li>
          <li><NavLink style={{ color: "white", textDecoration: "none" }} to="/profile">PROFILE</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;