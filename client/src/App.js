import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import {Provider} from "react-redux";

import store from "./store";
import About from "./pages/About";
import Home from "./pages/Home";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="*" element={<About />} />
            <Route 
              path="/" 
              element={<Home />}
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
