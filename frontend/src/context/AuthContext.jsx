import React, { createContext, useContext } from "react";
import {
  ClerkProvider,
  useUser as useClerkUser,
  useAuth as useClerkAuth,
  SignedIn as ClerkSignedIn,
  SignedOut as ClerkSignedOut,
  SignInButton as ClerkSignInButton,
  UserButton as ClerkUserButton,
} from "@clerk/clerk-react";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
export const isClerkConfigured = Boolean(
  clerkPublishableKey &&
    clerkPublishableKey.startsWith("pk_") &&
    !clerkPublishableKey.includes("your_clerk")
);

const MOCK_USER = {
  id: "learner-user-1",
  firstName: "Demo",
  lastName: "Learner",
  fullName: "Demo Learner",
  imageUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  primaryEmailAddress: { emailAddress: "learner@vibelearn.dev" },
};

const AuthContext = createContext({
  user: MOCK_USER,
  isLoaded: true,
  isSignedIn: true,
  userId: "learner-user-1",
  getToken: async () => null,
});

function ClerkBridge({ children }) {
  const clerkUser = useClerkUser();
  const clerkAuth = useClerkAuth();

  const value = {
    user: clerkUser.user,
    isLoaded: clerkUser.isLoaded,
    isSignedIn: clerkUser.isSignedIn,
    userId: clerkAuth.userId,
    getToken: clerkAuth.getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function MockBridge({ children }) {
  const value = {
    user: MOCK_USER,
    isLoaded: true,
    isSignedIn: true,
    userId: "learner-user-1",
    getToken: async () => null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }) {
  if (isClerkConfigured) {
    return (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <ClerkBridge>{children}</ClerkBridge>
      </ClerkProvider>
    );
  }

  return <MockBridge>{children}</MockBridge>;
}

export function useUser() {
  const ctx = useContext(AuthContext);
  return {
    user: ctx?.user || null,
    isLoaded: ctx?.isLoaded ?? true,
    isSignedIn: ctx?.isSignedIn ?? false,
  };
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return {
    getToken: ctx?.getToken || (async () => null),
    userId: ctx?.userId || null,
    isSignedIn: ctx?.isSignedIn ?? false,
    isLoaded: ctx?.isLoaded ?? true,
  };
}

export function SignedIn({ children }) {
  if (!isClerkConfigured) {
    return <>{children}</>;
  }
  return <ClerkSignedIn>{children}</ClerkSignedIn>;
}

export function SignedOut({ children }) {
  if (!isClerkConfigured) {
    return null;
  }
  return <ClerkSignedOut>{children}</ClerkSignedOut>;
}

export function SignInButton({ children, mode }) {
  if (!isClerkConfigured) {
    return <>{children}</>;
  }
  return <ClerkSignInButton mode={mode}>{children}</ClerkSignInButton>;
}

export function UserButton({ appearance, afterSignOutUrl }) {
  if (!isClerkConfigured) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-500/40 hover:border-primary-500 transition-colors shadow-sm">
          <img
            src={MOCK_USER.imageUrl}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }
  return <ClerkUserButton appearance={appearance} afterSignOutUrl={afterSignOutUrl} />;
}
