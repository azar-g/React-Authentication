import { useRef, useContext, useState } from "react";
import AuthContext from "../store/AuthContext";
import classes from "./ProfileForm.module.css";
import APIKEY from "../Auth/api-key";
import { useHistory } from "react-router-dom";

const ProfileForm = () => {
  const history = useHistory();
  const [newPasswordMessage, setNewPasswordMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const newPasswordInput = useRef();
  const { token } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPassword = newPasswordInput.current.value;
    console.log(newPassword);
    newPasswordInput.current.value = "";

    const setNewPassword = async () => {
      setLoading(true);
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${APIKEY}`,
        {
          method: "POST",
          body: JSON.stringify({
            idToken: token,
            password: newPassword,
            returnSecureToken: true,
          }),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw Error(data.error.message);

      return data;
    };
    try {
      const data = await setNewPassword();
      setLoading(false);
      console.log(data);
      data.idToken && setNewPasswordMessage("Password changed succesfully");
      history.push("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setNewPasswordMessage(error.message);
    }
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordInput} />
      </div>
      {newPasswordMessage && (
        <div className="centered message">
          <p>{newPasswordMessage}</p>
        </div>
      )}
      {loading ? (
        <div className="centered message">
          <p>Loading...</p>
        </div>
      ) : (
        <div className={classes.action}>
          <button>Change Password</button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
