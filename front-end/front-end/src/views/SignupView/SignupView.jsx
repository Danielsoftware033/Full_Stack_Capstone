import UserForm from '../../components/UserForm/UserForm'
import { useNews } from '../../contexts/NewsContext'
import { useNavigate } from 'react-router-dom'

const SignupView = () => {
  const { registerUser } = useNews()
  const navigate = useNavigate()


  const handleSignup = async (formData) => {
    const success = await registerUser(formData)
    if (success) {
      navigate('/login')
    }
  }


  return <UserForm submitFunction={handleSignup}/>
}

export default SignupView
