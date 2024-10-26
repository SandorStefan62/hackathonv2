import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";

import Login from "./pages/login/Login";
import HomePage from "./pages/home/Home";
import UserProfile from "./pages/user_profile/UserProfile";

import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import Party from "./pages/party/Party";
import ProtectedRoute from "./components/protected_route/ProtectedRoute";
import UserParties from "./pages/user_parties/UserParties";

function App() {
  const location = useLocation();
  const hideSidebarRoutes = ["/Login"];

  return (
    <>
      {!hideSidebarRoutes.includes(location.pathname) && <Sidebar />}
      <div className="w-scren h-screen flex justify-center items-center">
        <Routes location={location} key={location.pathname}>
          <Route
            exact
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route exact path="/Login" element={<Login />} />
          <Route
            exact
            path="/Home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/UserProfile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/Party"
            element={
              <ProtectedRoute>
                <Party />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/UserParties"
            element={
              <ProtectedRoute>
                <UserParties />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
