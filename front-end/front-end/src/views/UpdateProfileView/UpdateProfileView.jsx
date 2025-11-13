import { useState } from "react";
import { useNews } from "../../contexts/NewsContext";
import UserForm from "../../components/UserForm/UserForm";
import "./UpdateProfileView.css";

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

  const isSuccess = message.toLowerCase().includes("success");

  return (
    <div id="updateProfileView">
      <div id="updateProfileCard">
        <div id="updateProfileHeader">
          <h2 id="updateProfileTitle">Update Profile</h2>
          <p id="updateProfileSubtitle">Keep your information up to date.</p>
        </div>

        {message && (
          <div className={`updateMessage ${isSuccess ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <div id="updateProfileFormWrapper">
          <UserForm submitFunction={handleSubmit} initialData={user} />
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileView;
