import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { LoginPage, SignupPage } from "./components/Auth";
import { ArtBuilder } from "./components/ArtBuilder";
import { SocialFeed } from "./components/SocialFeed";

function App() {
  return (
    <Router>
      {/* Header with title and links */}
      <header style={headerStyles}>
        <div style={titleStyles}>AI Social Art</div>
        <nav style={navStyles}>
          <Link to="/login" style={linkStyles}>
            Login
          </Link>
          <Link to="/signup" style={linkStyles}>
            Signup
          </Link>
          <Link to="/social-feed" style={linkStyles}>
            Social Feed
          </Link>
          <Link to="/art-builder" style={linkStyles}>
            Art Builder
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/social-feed" element={<SocialFeed />} />
        <Route path="/art-builder" element={<ArtBuilder />} />
      </Routes>
    </Router>
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

