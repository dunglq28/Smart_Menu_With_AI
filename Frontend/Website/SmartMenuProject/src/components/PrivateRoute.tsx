import React from "react";
import { Navigate, Route } from "react-router-dom";

function PrivateRoute({ page: Element, layout: Layout, ...rest }: any) {
  const isLoggedIn = localStorage.getItem("token");

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <Route
      {...rest}
      element={
        <Layout>
          <Element />
        </Layout>
      }
    />
  );
}

export default PrivateRoute;
