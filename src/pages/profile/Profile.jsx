import React from "react";
import { useEffect, useState } from "react";
import { getUserById } from "../../services/userService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./css/profile.css";
import DefImage from "../../assets/profile-default.png";
import ChangeIcon from "../../assets/change-icon.png";
import ChangeProfilePopUpForm from "./components/ChangePopUpForm.jsx";

const Profile = () => {
  const { userId } = useAuth(); //
  const [user, setUser] = useState({
    id: 1,
    name: "Alex",
    email: "alex@gmail.com",
  });
  const [isChangeUserData, setChangeUserData] = useState(null);

  // useEffect(() => {
  //     if (!userId) return;

  //     getUserById(userId)
  //         .then(data => {
  //             console.log("User loaded:", data);
  //             setUser(data);
  //         })
  //         .catch(err => console.error("Get user error:", err.response?.data || err.message));
  // }, [userId]);

  const openChangeForm = (e) => {
    console.log(e.target.id);
    if (e.target.id == "change_user_name") {
      setChangeUserData({
        id: user.id,
        type: "name",
      });
    } else if (e.target.id == "change_user_email") {
      setChangeUserData({
        id: user.id,
        type: "email",
      });
    }
  };

  const closeForm = () => {
    setChangeUserData(null);
  };

  return (
    <div className="app_layout">
      <div className="container">
        <h1 id="profile_title">Your Profile</h1>
        <main className="main_profile">
          <div className="user_photo">
            <div id="photo">
              {user && user.photo != "" ? (
                <img src={DefImage} alt="" />
              ) : (
                <img src={DefImage} alt="default" />
              )}
            </div>
          </div>
          <div className="user_info">
            <div className="user_info_block">
              <p>
                Name: <span>{user ? user.name : "there is no name"}</span>
              </p>
              <div className="change_block">
                <img
                  src={ChangeIcon}
                  alt="change"
                  id="change_user_name"
                  onClick={openChangeForm}
                />
              </div>
            </div>
            <div className="user_info_block">
              <p>
                Email: <span>{user ? user.email : "there is no name"}</span>
              </p>
              <div className="change_block">
                <img
                  src={ChangeIcon}
                  alt="change"
                  id="change_user_email"
                  onClick={openChangeForm}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      {isChangeUserData && (
        <ChangeProfilePopUpForm user={isChangeUserData} onClose={closeForm} />
      )}
    </div>
  );
};

export default Profile;
