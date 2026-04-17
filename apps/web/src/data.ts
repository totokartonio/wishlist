import type { Item, Currency } from "@wishlist/types";

export const items: Item[] = [
  {
    id: "example-item",
    image: "Image",
    name: "Sony headphones",
    price: 100,
    currency: "USD",
    status: "want",
    link: "https://www.amazon.de/",
  },
];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  RUB: "₽",
  GBP: "£",
  HUF: "Ft",
  TRY: "₺",
  UAH: "₴",
  CZK: "Kč",
  PLN: "zł",
  CHF: "Fr",
  JPY: "¥",
  CNY: "¥",
};
