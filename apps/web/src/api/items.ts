import type { CreateItemDto, Item, UpdateItemDto } from "@wishlist/types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const getItems = async (wishlistId: string): Promise<Item[]> => {
  const response = await fetch(
    `${BASE_URL}/api/wishlists/${wishlistId}/items`,
    {
      credentials: "include",
    },
  );
  return handleResponse<Item[]>(response);
};

export const createItem = async (
  wishlistId: string,
  dto: CreateItemDto,
): Promise<Item> => {
  const response = await fetch(
    `${BASE_URL}/api/wishlists/${wishlistId}/items`,
    {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    },
  );
  return handleResponse<Item>(response);
};

export const updateItem = async (
  wishlistId: string,
  id: string,
  dto: UpdateItemDto,
): Promise<Item> => {
  const response = await fetch(
    `${BASE_URL}/api/wishlists/${wishlistId}/items/${id}`,
    {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    },
  );
  return handleResponse<Item>(response);
};

export const deleteItem = async (
  wishlistId: string,
  id: string,
): Promise<void> => {
  const response = await fetch(
    `${BASE_URL}/api/wishlists/${wishlistId}/items/${id}`,
    {
      credentials: "include",
      method: "DELETE",
    },
  );
  return handleResponse<void>(response);
};

export const claimItem = async (
  wishlistId: string,
  id: string,
): Promise<Item> => {
  const response = await fetch(
    `${BASE_URL}/api/wishlists/${wishlistId}/items/${id}/claim`,
    {
      credentials: "include",
      method: "POST",
    },
  );
  return handleResponse<Item>(response);
};

export const unclaimItem = async (
  wishlistId: string,
  id: string,
): Promise<Item> => {
  const response = await fetch(
    `${BASE_URL}/api/wishlists/${wishlistId}/items/${id}/unclaim`,
    {
      credentials: "include",
      method: "POST",
    },
  );
  return handleResponse<Item>(response);
};

export const archiveItem = async (
  wishlistId: string,
  id: string,
): Promise<Item> => {
  const response = await fetch(
    `${BASE_URL}/api/wishlists/${wishlistId}/items/${id}/archive`,
    {
      credentials: "include",
      method: "POST",
    },
  );
  return handleResponse<Item>(response);
};

export const unarchiveItem = async (
  wishlistId: string,
  id: string,
): Promise<Item> => {
  const response = await fetch(
    `${BASE_URL}/api/wishlists/${wishlistId}/items/${id}/unarchive`,
    {
      credentials: "include",
      method: "POST",
    },
  );
  return handleResponse<Item>(response);
};
