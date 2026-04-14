import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { WishlistsTable } from "./WishlistsTable";
import type { Wishlist } from "@wishlist/types";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    Link: ({
      children,
      to,
      params,
    }: {
      children: React.ReactNode;
      to: string;
      params?: Record<string, string>;
    }) => {
      const href = params
        ? Object.entries(params).reduce(
            (acc, [key, value]) => acc.replace(`$${key}`, value),
            to,
          )
        : to;
      return <a href={href}>{children}</a>;
    },
  };
});

const mockWishlists: Wishlist[] = [
  {
    id: "1",
    name: "My Wishlist",
    description: "First wishlist",
    visibility: "private",
    ownerId: "user1",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Birthday List",
    description: "Birthday wishes",
    visibility: "public",
    ownerId: "user1",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
];

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();

const defaultProps = {
  wishlists: mockWishlists,
  onEdit: mockOnEdit,
  onDelete: mockOnDelete,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("WishlistsTable", () => {
  test("renders table headers", () => {
    render(<WishlistsTable {...defaultProps} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Visibility")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("renders wishlists", () => {
    render(<WishlistsTable {...defaultProps} />);

    expect(screen.getByText("My Wishlist")).toBeInTheDocument();
    expect(screen.getByText("First wishlist")).toBeInTheDocument();
    expect(screen.getByText("Birthday List")).toBeInTheDocument();
    expect(screen.getByText("Birthday wishes")).toBeInTheDocument();
  });

  test("renders correct number of rows", () => {
    render(<WishlistsTable {...defaultProps} />);

    const rows = screen.getAllByRole("row");
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3);
  });

  test("renders empty table when no wishlists", () => {
    render(<WishlistsTable {...defaultProps} wishlists={[]} />);

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(1); // header only
  });

  test("wishlist name links to correct route", () => {
    render(<WishlistsTable {...defaultProps} />);

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/wishlists/1");
    expect(links[1]).toHaveAttribute("href", "/wishlists/2");
  });

  test("calls onEdit when edit button clicked", async () => {
    const user = userEvent.setup();
    render(<WishlistsTable {...defaultProps} />);

    const editButtons = screen.getAllByRole("button", { name: "Edit" });
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith("1");
  });

  test("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    render(<WishlistsTable {...defaultProps} />);

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });
});
