// // import React from "react";
// // import { Route, Routes } from "react-router-dom";

// // import Apps from "./Apps";
// // import Funds from "./Funds";
// // import Holdings from "./Holdings";

// // import Orders from "./Orders";
// // import Positions from "./Positions";
// // import Summary from "./Summary";
// // import WatchList from "./WatchList";
// // import { GeneralContextProvider } from "./GeneralContext";

// // const Dashboard = () => {
// //   return (
// //     <div className="dashboard-container">
// //       <GeneralContextProvider>
// //         <WatchList />
// //       </GeneralContextProvider>
// //       <div className="content">
// //         <Routes>
// //           <Route exact path="/" element={<Summary />} />
// //           <Route path="/orders" element={<Orders />} />
// //           <Route path="/holdings" element={<Holdings />} />
// //           <Route path="/positions" element={<Positions />} />
// //           <Route path="/funds" element={<Funds />} />
// //           <Route path="/apps" element={<Apps />} />
// //         </Routes>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;



// import React, { useEffect, useState } from "react";
// import { Routes, Route } from "react-router-dom";

// // 🔐 Firebase
// import { auth } from "../firebase";
// import { onAuthStateChanged } from "firebase/auth";

// // 📦 Components
// import Apps from "./Apps";
// import Funds from "./Funds";
// import Holdings from "./Holdings";
// import Orders from "./Orders";
// import Positions from "./Positions";
// import Summary from "./Summary";
// import WatchList from "./WatchList";
// import { GeneralContextProvider } from "./GeneralContext";

// const Dashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   // 🔐 Auth Protection
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (!currentUser) {
//         window.location.href = "http://localhost:3000/signup";
//       } else {
//         setUser(currentUser);
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // ⛔️ Block UI until auth check
//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "50px" }}>
//         <h2>Checking authentication...</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar / Watchlist */}
//       <GeneralContextProvider>
//         <WatchList />
//       </GeneralContextProvider>

//       {/* Main Content */}
//       <div className="content">
//         <Routes>
//           <Route path="/" element={<Summary />} />
//           <Route path="/orders" element={<Orders />} />
//           <Route path="/holdings" element={<Holdings />} />
//           <Route path="/positions" element={<Positions />} />
//           <Route path="/funds" element={<Funds />} />
//           <Route path="/apps" element={<Apps />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



/////////////////////////////////////


import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

// Components
import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";

const Dashboard = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const bootstrap = async () => {
      // ✅ STEP 1: Check if a Google access token was passed via URL
      // This happens when the user signs in via the frontend app (port 3000)
      // and gets redirected here. We use the token to sign into THIS app's
      // Firebase instance independently (cross-origin localStorage doesn't share).
      const params = new URLSearchParams(window.location.search);
      const gat = params.get("gat");

      if (gat) {
        try {
          // Reconstruct a Google credential from the access token
          const credential = GoogleAuthProvider.credential(null, gat);

          // Sign into this app's Firebase instance using that credential
          await signInWithCredential(auth, credential);

          // Clean the token out of the URL — don't leave it exposed
          window.history.replaceState({}, "", "/dashboard");
        } catch (err) {
          console.error("Cross-origin token sign-in failed:", err);
          // Token may be expired or invalid — redirect back to signup
          window.location.href = "http://localhost:3000/signup";
          return;
        }
      }

      // ✅ STEP 2: Now that we've handled any incoming token,
      // listen for Firebase auth state normally
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log("Auth state resolved. User:", currentUser);
        setUser(currentUser);
        setAuthChecked(true);
      });

      // Cleanup listener on unmount
      return () => unsubscribe();
    };

    bootstrap();
  }, []);

  // ⏳ Wait until Firebase finishes its auth check before rendering anything
  if (!authChecked) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <h2>Checking authentication...</h2>
        <p style={{ color: "#888" }}>Please wait</p>
      </div>
    );
  }

  // ❌ Auth check complete but no user found — send back to signup
  if (!user) {
    window.location.href = "http://localhost:3000/signup";
    return null;
  }

  // ✅ Authenticated — render the dashboard
  return (
    <div className="dashboard-container">
      <GeneralContextProvider>
        <WatchList />
      </GeneralContextProvider>

      <div className="content">
        <Routes>
          <Route path="/" element={<Summary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/apps" element={<Apps />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;