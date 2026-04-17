import type { WishlistVisibility } from "@wishlist/types";

type Props = {
  name: string;
  visibility: WishlistVisibility;
  created: string;
};

const Info = ({ name, visibility, created }: Props) => {
  return (
    <section>
      <h2>{name}</h2>
      <p>{visibility}</p>
      <p>{created}</p>
    </section>
  );
};

export { Info };
