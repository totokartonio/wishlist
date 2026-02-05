export const ITEM_STATUSES = [
  "want",
  "bought",
  "archived",
  "reserved",
] as const;
export const CURRENCIES = ["USD", "EUR", "RUB"] as const;

type ItemStatus = (typeof ITEM_STATUSES)[number];
type Currency = (typeof CURRENCIES)[number];

type Item = {
  id: string;
  image: string;
  name: string;
  price: number;
  currency: Currency;
  status: ItemStatus;
  link: string;
};

export type { Item, ItemStatus, Currency };
