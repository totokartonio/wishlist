import type { Wishlist, UserProfile } from "@wishlist/types";
import { ApiError } from "../lib/apiError";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new ApiError(response.status);
  }
  return response.json() as Promise<T>;
};

export const getUser = async (userId: string): Promise<UserProfile> => {
  const response = await fetch(`${BASE_URL}/api/users/${userId}`);
  return handleResponse<UserProfile>(response);
};

export const getUserWishlists = async (userId: string): Promise<Wishlist[]> => {
  const response = await fetch(`${BASE_URL}/api/users/${userId}/wishlists`, {
    credentials: "include",
  });
  return handleResponse<Wishlist[]>(response);
};
