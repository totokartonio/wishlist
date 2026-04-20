export const ITEM_STATUSES = [
  "want",
  "bought",
  "archived",
  "reserved",
] as const;

export const CURRENCIES = [
  "USD",
  "EUR",
  "RUB",
  "GBP",
  "HUF",
  "TRY",
  "UAH",
  "CZK",
  "PLN",
  "CHF",
  "JPY",
  "CNY",
] as const;

export type ItemStatus = (typeof ITEM_STATUSES)[number];
export type Currency = (typeof CURRENCIES)[number];

export type Item = {
  id: string;
  image: string;
  name: string;
  price: number;
  currency: Currency | null;
  status: ItemStatus;
  link: string;
};

export type CreateItemDto = Omit<Item, "id">;
export type UpdateItemDto = Partial<CreateItemDto>;

export type WishlistVisibility = "private" | "public" | "invite";

export const WISHLIST_VISIBILITY = ["private", "public", "invite"] as const;

export type Wishlist = {
  id: string;
  name: string;
  description: string | null;
  visibility: WishlistVisibility;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type WishlistRole = "owner" | "editor" | "viewer" | null;

export type WishlistWithRole = Wishlist & {
  role: WishlistRole;
};

export type CreateWishlistDto = {
  name: string;
  description?: string;
  visibility?: WishlistVisibility;
};

export type UpdateWishlistDto = Partial<CreateWishlistDto>;

export type Collaborator = {
  id: string;
  userId: string;
  wishlistId: string;
  role: "editor" | "viewer";
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export type InviteLink = {
  id: string;
  wishlistId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  url: string;
};

export type InviteWithWishlist = InviteLink & {
  wishlist: {
    id: string;
    name: string;
    description: string | null;
    visibility: WishlistVisibility;
  };
};

export type UserProfile = { id: string; name: string };
