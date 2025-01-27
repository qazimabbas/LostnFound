import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "./atoms/userAtom";
import LandingPage from "./Pages/LandingPage";
import AuthenticationPage from "./Pages/AuthenticationPage";
import HomePage from "./Pages/HomePage";
import MyListingsPage from "./Pages/MyListingsPage";
import ResponsesPage from "./Pages/ResponsesPage";
import ItemPage from "./Pages/ItemPage";
import UpdatePage from "./Pages/UpdatePage";
import { Toaster } from "react-hot-toast";

const App = () => {
  const user = useRecoilValue(userAtom);
  return (
    <div className="min-w-screen min-h-screen bg-white dark:bg-[#0f1729] transition-colors duration-200">
      <Navbar />
      <Routes>
        <>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={user ? <Navigate to="/home" /> : <AuthenticationPage />}
          />
          <Route
            path="/home"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/listings"
            element={user ? <MyListingsPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/responses"
            element={user ? <ResponsesPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/item/:id"
            element={user ? <ItemPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/update"
            element={user ? <UpdatePage /> : <Navigate to="/auth" />}
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </>
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
};

export default App;
