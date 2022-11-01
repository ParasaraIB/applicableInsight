import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import {Provider} from "react-redux";

import store from "./store";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="*" element={<About />} />
            <Route 
              path="/" 
              element={
                <LoginChecker redirectTo={"/home"}>
                  <Login/>
                </LoginChecker>
              }
            />
            <Route
              path="home"
              element={
                <ProtectedRoute redirectTo="/">
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

function ProtectedRoute({children, redirectTo}) {
  const isAuthenticated = localStorage.getItem("access_token");
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

function LoginChecker({children, redirectTo}) {
  const isAuthenticated = localStorage.getItem("access_token");
  return isAuthenticated ? <Navigate to={redirectTo} /> : children;
}

export default App;
