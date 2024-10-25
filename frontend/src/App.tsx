import { Routes, Route, Link } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn, SignInButton, UserButton } from "@clerk/clerk-react";
import { ArtBuilder } from "./components/ArtBuilder";
import { SocialFeed } from "./components/SocialFeed";
import { DrawingPage } from "./components/DrawingPage";
import { DrawingSocialFeed } from "./components/DrawingSocialFeed";

function App() {
  return (
    <>
      <header style={headerStyles}>
        <div style={titleStyles}>AI Social Art</div>
        <nav style={navStyles}>
          <Link to="/social-feed" style={linkStyles}>Social Feed</Link>
          <Link to="/art-builder" style={linkStyles}>Art Builder</Link>
          <Link to="/drawing-page" style={linkStyles}>Drawing Page</Link>
          <Link to="/drawing-social-feed" style={linkStyles}>Drawing Social Feed</Link>
        </nav>
        {/* Clerk Authentication */}
        <div style={authButtonStyles}>
          <SignedOut><SignInButton /></SignedOut>
          <SignedIn><UserButton /></SignedIn>
        </div>
      </header>

      <Routes>

        {/* Protected routes: Require the user to be signed in */}
        <Route path="/social-feed" element={<SignedIn><SocialFeed /></SignedIn>} />
        <Route path="/art-builder" element={<SignedIn><ArtBuilder /></SignedIn>} />
        <Route path="/drawing-page" element={<SignedIn><DrawingPage /></SignedIn>} />
        <Route path="/drawing-social-feed" element={<SignedIn><DrawingSocialFeed /></SignedIn>} />

        {/* Redirect to SignIn if user is not signed in */}
        <Route path="*" element={<SignedOut><RedirectToSignIn /></SignedOut>} />
      </Routes>
    </>
  );
}

export default App;

// Inline Styles
const headerStyles = {
  display: "flex",
  justifyContent: "space-between",
  padding: "20px",
  backgroundColor: "#252424",
  color: "#fff",
  alignItems: "center",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const titleStyles = {
  fontSize: "24px",
  fontWeight: "bold",
};

const navStyles = {
  display: "flex",
  gap: "20px",
};

const linkStyles = {
  color: "#61dafb",
  textDecoration: "none",
  fontSize: "18px",
  fontWeight: "bold",
};

const authButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};
