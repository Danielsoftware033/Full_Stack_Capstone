import UserForm from '../../components/UserForm/UserForm'
import { useNews } from '../../contexts/NewsContext'

const SignupView = () => {
  const { registerUser } = useNews()

  return <UserForm submitFunction={registerUser} />
}

export default SignupView
