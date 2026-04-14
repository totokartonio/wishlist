import type {
  Wishlist,
  CreateWishlistDto,
  UpdateWishlistDto,
} from "@wishlist/types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const getWishlists = async (): Promise<Wishlist[]> => {
  const response = await fetch(`${BASE_URL}/api/wishlists`, {
    credentials: "include",
  });
  return handleResponse<Wishlist[]>(response);
};

export const getWishlist = async (id: string): Promise<Wishlist> => {
  const response = await fetch(`${BASE_URL}/api/wishlists/${id}`, {
    credentials: "include",
  });
  return handleResponse<Wishlist>(response);
};

export const createWishlist = async (
  dto: CreateWishlistDto,
): Promise<Wishlist> => {
  const response = await fetch(`${BASE_URL}/api/wishlists`, {
    credentials: "include",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return handleResponse<Wishlist>(response);
};

export const updateWishlist = async (
  id: string,
  dto: UpdateWishlistDto,
): Promise<Wishlist> => {
  const response = await fetch(`${BASE_URL}/api/wishlists/${id}`, {
    credentials: "include",
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return handleResponse<Wishlist>(response);
};

export const deleteWishlist = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/wishlists/${id}`, {
    credentials: "include",
    method: "DELETE",
  });
  return handleResponse<void>(response);
};
