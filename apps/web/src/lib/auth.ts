import { auth, currentUser } from "@clerk/nextjs/server";

export async function getAuth() {
  return await auth();
}

export async function requireAuthUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  return userId;
}

export async function getCurrentUser() {
  return await currentUser();
}
