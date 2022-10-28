import { useState, useRef, useContext } from "react";
import classes from "./AuthForm.module.css";
import AuthContext from "../store/AuthContext";
import APIKEY from "./api-key";
import { useHistory } from "react-router-dom";

const AuthForm = () => {
  const history = useHistory();
  const context = useContext(AuthContext);
  console.log(context);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMesssage, setResponseMessage] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;
    const reqBody = { email, password };

    const PostData = async () => {
      setIsLoading(true);
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:${
          !isLogin ? "signUp" : "signInWithPassword"
        }?key=${APIKEY}`,
        // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
        {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (!response.ok) throw Error(data.error.message);

      emailInputRef.current.value = "";
      passwordInputRef.current.value = "";

      return data;
    };

    try {
      const data = await PostData();
      const { idToken: token } = data;
      context.login(token, 30000);
      setResponseMessage(
        !isLogin
          ? "Your registration is succesful"
          : "You logged in succesfully"
      );
      setIsLoading(false);
      history.replace("/profile");
    } catch (error) {
      setResponseMessage(error.message);
      setIsLoading(false);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading ? (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          ) : (
            <p>Loading...</p>
          )}

          {responseMesssage && <p>{responseMesssage}</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
