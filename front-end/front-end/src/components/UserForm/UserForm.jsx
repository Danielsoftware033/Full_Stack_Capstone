import React from 'react'
import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

const UserForm = ({ submitFunction, initialData }) => {
  const [formData, setFormData] = useState({  //used copilot for adding initialData since it will add more flexibity to this component
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
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type="text" name="first_name" placeholder="First Name" onChange={(e) => handleChange(e)} value={formData.first_name} />
        <input type="text" name="last_name" placeholder="Last Name" onChange={(e) => handleChange(e)} value={formData.last_name} />
        <input type="text" name="username" placeholder="Username" onChange={(e) => handleChange(e)} value={formData.username} />
        <input type="email" name="email" placeholder="Email" onChange={(e) => handleChange(e)} value={formData.email} />
        <input type="password" name="password" placeholder="Password" onChange={(e) => handleChange(e)} value={formData.password} />
        <input type="number" name="age" placeholder="Age" onChange={(e) => handleChange(e)} value={formData.age} />
        <input type="text" name="political_leaning" placeholder="Political Leaning" onChange={(e) => handleChange(e)} value={formData.political_leaning} />
        <button type="submit">Submit</button> 
      </form>
    </div>
  )
}

export default UserForm
