import React, { useState } from "react";
import "../css/profile.css";
import axios from "axios";

const ChangeProfilePopUpForm = ({ user, onClose }) => {
  const [userProps, setUserProps] = useState(user);

  const handleSubmit = (e) => {
    e.preventDefault();
    changeUserData(userProps.id, e.target[0].value, userProps.type);
  };
  async function changeUserData(userId, newData, type) {
    const id = userId;
    let newUserData;
    if (type == "name") {
      newUserData = {
        name: newData,
      };
    } else if (type == "email") {
      newUserData = {
        email: newData,
      };
    }
    const token = localStorage.getItem("jwtToken");
    const resp = await axios.patch(
      `http://localhost:7172/change-user-data/${userId}`,
      { newUserData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    resp.status == "OK" ? onClose() : null;
  }

  return (
    <div className="pop_up">
      <form onSubmit={handleSubmit}>
        <div className="change_form_block">
          <h1>Change your {userProps.type}</h1>
        </div>
        <div className="change_form_block">
          <input
            type="text"
            id="change_user_data"
            placeholder={`Enter new ${userProps.type}`}
            required
          />
          <div className="btn_cont">
            <button type="submit">Submit</button>
            <button id="cancel_btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangeProfilePopUpForm;
