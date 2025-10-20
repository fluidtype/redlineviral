import { authEnabled } from "./authToggle";

type ClerkModule = typeof import("@clerk/nextjs/server");

async function loadClerk(): Promise<ClerkModule> {
  if (!authEnabled) {
    throw new Error("Clerk auth is disabled in this environment");
  }
  return import("@clerk/nextjs/server");
}

export async function getAuth() {
  if (!authEnabled) {
    return {
      userId: null,
      sessionId: null,
      getToken: async () => null,
      protect: async () => {
        throw new Error("Auth disabled");
      },
      signOut: async () => {
        throw new Error("Auth disabled");
      },
      redirectToSignIn: () => {
        throw new Error("Auth disabled");
      },
      isPublicRoute: () => false,
      isApiRoute: () => false,
      isAuthenticated: false,
    };
  }
  const { auth } = await loadClerk();
  return auth();
}

export async function requireAuthUser() {
  if (!authEnabled) {
    throw new Error("Unauthenticated");
  }
  const { auth } = await loadClerk();
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  return userId;
}

export async function getCurrentUser() {
  if (!authEnabled) {
    return null;
  }
  const { currentUser } = await loadClerk();
  return currentUser();
}