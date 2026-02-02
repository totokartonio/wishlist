export type ItemStatus = "want" | "bought" | "archived";

export type Item = {
  id: string;
  image: string;
  name: string;
  price: string;
  status: ItemStatus;
  link: string;
};
