import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { auth } from "../../firebase";

function ProtectedRoute({ children, ...rest }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    React.cloneElement(children, { ...rest })
  ) : (
    <Navigate to="/Login" />
  );
}

export default ProtectedRoute;
