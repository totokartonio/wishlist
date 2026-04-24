import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [anonymousClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
