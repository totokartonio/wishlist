import type { Collaborator } from "@wishlist/types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const getCollaborators = async (
  wishlistId: string,
): Promise<Collaborator[]> => {
  const response = await fetch(
    `${BASE_URL}/api/wishlists/${wishlistId}/collaborators`,
    { credentials: "include" },
  );
  return handleResponse<Collaborator[]>(response);
};

export const updateCollaborator = async (
  wishlistId: string,
  id: string,
  role: string,
): Promise<Collaborator> => {
  const response = await fetch(
    `${BASE_URL}/api/wishlists/${wishlistId}/collaborators/${id}`,
    {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: role }),
    },
  );
  return handleResponse<Collaborator>(response);
};

export const removeCollaborator = async (
  wishlistId: string,
  id: string,
): Promise<void> => {
  const response = await fetch(
    `${BASE_URL}/api/wishlists/${wishlistId}/collaborators/${id}`,
    {
      credentials: "include",
      method: "DELETE",
    },
  );
  return handleResponse<void>(response);
};
