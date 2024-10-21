import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { ArtBuilder } from './components/ArtBuilder';
import { SocialFeed } from './components/SocialFeed';
import { Login } from './components/Login';

const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY; // Replace with your Clerk API

function App() {
  return (
    <ClerkProvider frontendApi={clerkFrontendApi}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/art-builder" element={
            <SignedIn>
              <ArtBuilder />
            </SignedIn>
          } />
          <Route path="/feed" element={
            <SignedIn>
              <SocialFeed />
            </SignedIn>
          } />
          <Route path="*" element={<RedirectToSignIn />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
