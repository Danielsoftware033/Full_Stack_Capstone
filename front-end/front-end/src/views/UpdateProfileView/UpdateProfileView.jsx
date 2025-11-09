import { useState } from "react";
import { useNews } from "../../contexts/NewsContext";
import UserForm from "../../components/UserForm/UserForm";

const UpdateProfileView = () => {
  const { user, updateUser } = useNews();
  const [message, setMessage] = useState("");


  const handleSubmit = async (formData) => {
    const updatesuccess = await updateUser(formData);
    if (updatesuccess) {
      setMessage("Profile updated successfully.");
    } else {
      setMessage("Something went wrong while updating.");
    }
  };

  return (
    <div>
      <h1>Update Profile</h1>

      {message && <p>{message}</p>}

      <UserForm submitFunction={handleSubmit} initialData={user}/>
    </div>
  );
};

export default UpdateProfileView;
