export const ITEM_STATUSES = [
  "want",
  "bought",
  "archived",
  "reserved",
] as const;

export const CURRENCIES = ["USD", "EUR", "RUB"] as const;

export type ItemStatus = (typeof ITEM_STATUSES)[number];
export type Currency = (typeof CURRENCIES)[number];

export type Item = {
  id: string;
  image: string;
  name: string;
  price: number;
  currency: Currency;
  status: ItemStatus;
  link: string;
};

export type CreateItemDto = Omit<Item, "id">;
export type UpdateItemDto = Partial<CreateItemDto>;
