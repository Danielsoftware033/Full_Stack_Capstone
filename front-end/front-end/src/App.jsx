import NavBar from './components/NavBar/NavBar'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomeView from "./views/HomeView/HomeView"
import SearchView from "./views/SearchView/SearchView"
import LoginView from './views/LoginView/LoginView'
import SignupView from './views/SignupView/SignupView'
import ProfileView from './views/ProfileView/ProfileView'
import UpdateProfileView from './views/UpdateProfileView/UpdateProfileView'
import SavedView from './views/SavedView/SavedView'
import ForumView from './views/ForumView/ForumView'
import CreateTopicView from './views/CreateTopicView/CreateTopicView'
import TopicView from './views/TopicView/TopicView'




function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<HomeView/>}/>
          <Route path='/search' element={<SearchView/>}/>
          <Route path="/login" element={<LoginView />} />
          <Route path="/signup" element={<SignupView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/profile/update" element={<UpdateProfileView />} />     
          <Route path="/saved" element={<SavedView />} />
          <Route path="/forum" element={<ForumView />} />  
          <Route path="/forum/create-topic" element={<CreateTopicView />} /> 
          <Route path="/forum/topic/:topicId" element={<TopicView />} />   
        </Routes>
        
      </BrowserRouter>
  
    </>
  )
}

export default App