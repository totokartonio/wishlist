import type { InviteLink, InviteWithWishlist } from "@wishlist/types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const createInvite = async (wishlistId: string): Promise<InviteLink> => {
  const response = await fetch(
    `${BASE_URL}/api/wishlists/${wishlistId}/invites`,
    {
      credentials: "include",
      method: "POST",
    },
  );

  return handleResponse<InviteLink>(response);
};

export const getInvite = async (token: string): Promise<InviteWithWishlist> => {
  const response = await fetch(`${BASE_URL}/api/invites/${token}`);

  return handleResponse<InviteWithWishlist>(response);
};

export const joinInvite = async (token: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/invites/${token}/join`, {
    credentials: "include",
    method: "POST",
  });
  return handleResponse<void>(response);
};
