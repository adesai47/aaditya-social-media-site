import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export const Login = () => {
  return (
    <div>
      <h2>Login to Artsy Fartsy</h2>
      <SignIn />
    </div>
  );
};
