import { SignIn, SignUp } from "@clerk/clerk-react";

export function LoginPage() {
  return (
    <div style={pageStyles}>
      <h2>Login Page</h2>
      <SignIn />
    </div>
  );
}

export function SignupPage() {
  return (
    <div style={pageStyles}>
      <h2>Signup Page</h2>
      <SignUp />
    </div>
  );
}

const pageStyles = {
  padding: "20px",
  textAlign: "center",
};
