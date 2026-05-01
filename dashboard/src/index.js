// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./index.css";
// import Home from "./components/Home";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/*" element={<Home />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );


/////////////////////////


import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Home from "./components/Home";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* ✅ Route to Home, NOT Dashboard directly.
            Home renders <TopBar /> + <Dashboard /> together,
            which is why the header was missing before. */}
        <Route path="/dashboard/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
