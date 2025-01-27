import React from "react";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/authAtom";
import Login from "../components/Login";
import Signup from "../components/Signup";

const AuthenticationPage = () => {
  const authState = useRecoilValue(authAtom);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      {authState === "login" ? <Login /> : <Signup />}
    </div>
  );
};

export default AuthenticationPage;
