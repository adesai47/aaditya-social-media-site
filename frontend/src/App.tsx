import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage, SignupPage } from "./components/Auth";
import { ArtBuilder } from "./components/ArtBuilder";
import { SocialFeed } from "./components/SocialFeed";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SocialFeed />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/art-builder" element={<ArtBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
