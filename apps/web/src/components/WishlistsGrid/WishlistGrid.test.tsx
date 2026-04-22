import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { WishlistsGrid } from "./WishlistsGrid";
import type { WishlistWithRole } from "@wishlist/types";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

const mockWishlists: WishlistWithRole[] = [
  {
    id: "1",
    name: "Birthday Wishlist",
    description: "My birthday wishes",
    visibility: "public",
    ownerId: "user-1",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    role: "owner",
  },
  {
    id: "2",
    name: "Holiday List",
    description: null,
    visibility: "private",
    ownerId: "user-1",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
    role: "owner",
  },
];

describe("WishlistsGrid", () => {
  test("renders all wishlists", () => {
    render(<WishlistsGrid wishlists={mockWishlists} color="primary" />);
    expect(screen.getByText("Birthday Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Holiday List")).toBeInTheDocument();
  });

  test("renders description when provided", () => {
    render(<WishlistsGrid wishlists={mockWishlists} color="primary" />);
    expect(screen.getByText("My birthday wishes")).toBeInTheDocument();
  });

  test("does not render description when null", () => {
    render(<WishlistsGrid wishlists={mockWishlists} color="primary" />);
    const descriptions = screen.queryAllByText("null");
    expect(descriptions).toHaveLength(0);
  });

  test("renders visibility badge for each wishlist", () => {
    render(<WishlistsGrid wishlists={mockWishlists} color="primary" />);
    expect(screen.getByText("Public")).toBeInTheDocument();
    expect(screen.getByText("Private")).toBeInTheDocument();
  });

  test("renders links to wishlist pages", () => {
    render(<WishlistsGrid wishlists={mockWishlists} color="primary" />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
  });

  test("renders empty grid when no wishlists", () => {
    render(<WishlistsGrid wishlists={[]} color="primary" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
