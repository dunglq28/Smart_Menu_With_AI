import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/RouterApp";
import { DefaultLayout } from "./layouts";
import { ToastContainer } from "react-toastify";
import "../node_modules/react-toastify/dist/ReactToastify.css";
import { DataProvider } from "./store/DataContext";

function App(): JSX.Element {
  return (
    <>
      <DataProvider>
        <Router>
          <div className="App">
            <Routes>
              {publicRoutes.map((route, index) => {
                const Layout =
                  route.layout === null
                    ? Fragment
                    : route.layout || DefaultLayout;

                const Page = route.component;

                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                );
              })}
            </Routes>
          </div>
        </Router>
      </DataProvider>
      <ToastContainer />
    </>
  );
}

export default App;
