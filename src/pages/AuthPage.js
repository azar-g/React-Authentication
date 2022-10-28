import AuthForm from "../components/Auth/AuthForm";
import AuthContext from "../components/store/AuthContext";
import { useContext } from "react";

const AuthPage = () => {
  const context = useContext(AuthContext);
  // console.log(context);
  return <AuthForm />;
};

export default AuthPage;
