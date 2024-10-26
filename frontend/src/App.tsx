import { Routes, Route, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton, RedirectToSignIn } from "@clerk/clerk-react";
import { ArtBuilder } from "./components/ArtBuilder";
import { SocialFeed } from "./components/SocialFeed";
import { DrawingPage } from "./components/DrawingPage";
import { DrawingSocialFeed } from "./components/DrawingSocialFeed";
import { useState } from "react";
import { PencilRuler, RadioTower } from 'lucide-react'; // Importing the icons

function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [feedDropdownOpen, setFeedDropdownOpen] = useState(false);
  const [hoveredFeed, setHoveredFeed] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <header style={headerStyles}>
        {/* Title */}
        <div style={titleStyles}>AI Social Art</div>
        
        {/* Centered Navigation */}
        <nav style={navStyles}>
          {/* Feeds Tab (Replaced with RadioTower Icon) */}
          <div 
            style={iconTabStyles} 
            onMouseEnter={() => setFeedDropdownOpen(true)} 
            onMouseLeave={() => {
              setFeedDropdownOpen(false);
              setHoveredFeed(null); // Reset hovered feed item on mouse leave
            }}
          >
            <RadioTower style={iconStyles} className="icon-pop" /> {/* Using the RadioTower icon */}
            
            {/* Dropdown for feeds */}
            {feedDropdownOpen && (
              <div style={dropdownStyles}>
                <div 
                  style={{
                    ...dropdownItemStyles,
                    backgroundColor: hoveredFeed === "socialFeed" ? "#333" : "#444", // Darker on hover
                  }}
                  onMouseEnter={() => setHoveredFeed("socialFeed")}
                  onMouseLeave={() => setHoveredFeed(null)}
                  onClick={() => navigate("/social-feed")}
                >
                  Blob Social Feed
                </div>
                <div 
                  style={{
                    ...dropdownItemStyles,
                    backgroundColor: hoveredFeed === "drawingFeed" ? "#333" : "#444", // Darker on hover
                  }}
                  onMouseEnter={() => setHoveredFeed("drawingFeed")}
                  onMouseLeave={() => setHoveredFeed(null)}
                  onClick={() => navigate("/drawing-social-feed")}
                >
                  Drawing Social Feed
                </div>
              </div>
            )}
          </div>

          {/* Editor Tab (Replaced with PencilRuler Icon) */}
          <div 
            style={iconTabStyles}
            onMouseEnter={() => setDropdownOpen(true)} 
            onMouseLeave={() => {
              setDropdownOpen(false);
              setHoveredItem(null); // Reset hovered item on mouse leave
            }}
          >
            <PencilRuler style={iconStyles} className="icon-pop" />  {/* Using the PencilRuler icon */}
            
            {/* Dropdown options */}
            {dropdownOpen && (
              <div style={dropdownStyles}>
                <div 
                  style={{
                    ...dropdownItemStyles,
                    backgroundColor: hoveredItem === "blob" ? "#333" : "#444", // Darker on hover
                  }}
                  onMouseEnter={() => setHoveredItem("blob")}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => navigate("/art-builder")}
                >
                  Blob Editor
                </div>
                <div 
                  style={{
                    ...dropdownItemStyles,
                    backgroundColor: hoveredItem === "drawing" ? "#333" : "#444", // Darker on hover
                  }}
                  onMouseEnter={() => setHoveredItem("drawing")}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => navigate("/drawing-page")}
                >
                  Drawing Editor
                </div>
              </div>
            )}
          </div>
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
  justifyContent: "space-between", // Ensures space between elements
  alignItems: "center",            // Vertically aligns items in the center
  padding: "20px",
  backgroundColor: "#252424",
  color: "#fff",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const titleStyles = {
  fontSize: "24px",
  fontWeight: "bold",
  flex: 1, // Takes up available space
};

const navStyles = {
  display: "flex",
  justifyContent: "center", // Centers the navigation items
  gap: "20px",
  flex: 1, // Takes up available space between title and authentication buttons
};

const authButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  flex: 1, // Takes up available space and aligns to the right
};

// Reused for both the Editor and Feeds tabs
const iconTabStyles: React.CSSProperties = {
  position: "relative",
  display: "inline-block",
  cursor: "pointer",
};

const dropdownStyles: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  left: 0,
  backgroundColor: "#333",
  padding: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  zIndex: 1000,
};

const dropdownItemStyles = {
  padding: "8px 16px",
  color: "#fff",
  backgroundColor: "#444",
  cursor: "pointer",
  textDecoration: "none",
  transition: "background-color 0.2s ease-in-out",
};

const iconStyles = {
  width: "24px", // Adjust the size as needed
  height: "24px", 
  color: "#61dafb", // Use a matching color
  transition: "transform 0.2s ease-in-out", // Adding transition for smooth pop-out effect
};

// Custom CSS class for pop-out effect on hover
const popOutStyles = `
.icon-pop:hover {
  transform: scale(1.2);  /* Make the icon 20% larger on hover */
}
`;

// Add the custom CSS to the document
const styleElement = document.createElement("style");
styleElement.textContent = popOutStyles;
document.head.appendChild(styleElement);
