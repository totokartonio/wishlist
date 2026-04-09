import type { CreateItemDto, Item, UpdateItemDto } from "@wishlist/types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const getItems = async (): Promise<Item[]> => {
  const response = await fetch(`${BASE_URL}/api/items`);
  return handleResponse<Item[]>(response);
};

export const createItem = async (dto: CreateItemDto): Promise<Item> => {
  const response = await fetch(`${BASE_URL}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return handleResponse<Item>(response);
};

export const updateItem = async (
  id: string,
  dto: UpdateItemDto,
): Promise<Item> => {
  const response = await fetch(`${BASE_URL}/api/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return handleResponse<Item>(response);
};

export const deleteItem = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/items/${id}`, {
    method: "DELETE",
  });
  return handleResponse<void>(response);
};
