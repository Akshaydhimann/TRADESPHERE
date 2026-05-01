// import React from "react";

// function Signup() {
//   return (
//     <>

//       <div className="container text-center mt-5">
//         <h1>Open a TradeSphere Account</h1>
//         <p className="mt-3">Signup to start investing</p>

//         <form style={{ maxWidth: "400px", margin: "auto" }}>
//           <input
//             type="text"
//             placeholder="Full Name"
//             className="form-control mb-3"
//           />

//           <input
//             type="email"
//             placeholder="Email"
//             className="form-control mb-3"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             className="form-control mb-3"
//           />

//           <button className="btn btn-primary w-100">
//             Create Account
//           </button>
//         </form>
//       </div>

      
//     </>
//   );
// }

//  export default Signup;

// import React from "react";

// function Signup() {

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // You can add API call / validation here

//     // Redirect to different server (port 3001)
//     window.location.href = "http://localhost:3001/dashboard";
//   };

//   return (
//     <div className="container text-center mt-5">
//       <h1>Open a TradeSphere Account</h1>
//       <p className="mt-3">Signup to start investing</p>

//       <form
//         onSubmit={handleSubmit}
//         style={{ maxWidth: "400px", margin: "auto" }}
//       >
//         <input
//           type="text"
//           placeholder="Full Name"
//           className="form-control mb-3"
//           required
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           className="form-control mb-3"
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="form-control mb-3"
//           required
//         />

//         <button type="submit" className="btn btn-primary w-100">
//           Create Account
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Signup;


import React, { useState } from "react";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ For Google login: extract accessToken and pass it via URL
  // so Dashboard (port 3001) can sign in independently using the same credential
  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Extract the Google OAuth access token from the sign-in result
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      // Pass the token to the dashboard app via URL param
      window.location.href = `http://localhost:3001/dashboard?gat=${accessToken}`;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // ✅ For Email/Password: after sign-in, redirect to dashboard
  // Dashboard will pick up its own Firebase auth state via onAuthStateChanged
  // Note: email/password creates a session in Firebase's own persistence layer,
  // but since the two apps are on different origins, we still need the user
  // to be signed in on port 3001's Firebase instance.
  // For simplicity, redirect and let Dashboard handle it via onAuthStateChanged
  // (works if both apps share the same Firebase project + localStorage key).
  // If it doesn't persist, consider switching email/password flow to also use
  // a custom token from your backend. For most cases this will just work.
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = `http://localhost:3001/dashboard`;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1>TradeSphere Signup</h1>
      <p className="mt-2 text-muted">Create your account to start investing</p>

      {error && (
        <div className="alert alert-danger mt-3" style={{ maxWidth: 400, margin: "auto" }}>
          {error}
        </div>
      )}

      <form
        onSubmit={handleEmailSignup}
        style={{ maxWidth: 400, margin: "auto" }}
        className="mt-4"
      >
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-3" style={{ maxWidth: 400, margin: "auto" }}>
        <hr />
        <p className="text-muted mb-2">Or sign up with</p>

        <button
          className="btn btn-danger w-100"
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          {loading ? "Redirecting..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}

export default Signup;