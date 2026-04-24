import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Dashboard } from "./Dashboard";
import { renderWithClient } from "../../test/utils";
import { getWishlists, createWishlist } from "../../api/wishlists";

vi.mock("../../api/wishlists");
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

const mockWishlist = {
  id: "1",
  name: "My Wishlist",
  description: "Test wishlist",
  visibility: "private" as const,
  ownerId: "user1",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  role: "owner" as const,
  hideClaimsFromOwner: true,
};

beforeEach(() => {
  vi.mocked(getWishlists).mockResolvedValue([mockWishlist]);
  vi.mocked(createWishlist).mockResolvedValue(mockWishlist);
});

describe("Dashboard", () => {
  test("renders dashboard with wishlists", async () => {
    renderWithClient(<Dashboard />);

    await screen.findByText("Dashboard");

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("My Wishlist")).toBeInTheDocument();
  });

  test("opens create modal when button clicked", async () => {
    const user = userEvent.setup();
    renderWithClient(<Dashboard />);

    await screen.findByText("Dashboard");

    await user.click(screen.getByRole("button", { name: "Create wishlist" }));
    expect(screen.getByText("New Wishlist")).toBeInTheDocument();
  });

  test("creates wishlist when form submitted", async () => {
    const newWishlist = {
      ...mockWishlist,
      id: "2",
      name: "New Wishlist",
    };

    vi.mocked(createWishlist).mockResolvedValue(newWishlist);
    vi.mocked(getWishlists)
      .mockResolvedValueOnce([mockWishlist])
      .mockResolvedValueOnce([mockWishlist, newWishlist]);

    const user = userEvent.setup();
    renderWithClient(<Dashboard />);
    await screen.findByText("Dashboard");

    await user.click(screen.getByRole("button", { name: "Create wishlist" }));
    await user.type(screen.getByLabelText("Name:"), "New Wishlist");
    await user.type(screen.getByLabelText("Description:"), "A description");
    await user.click(screen.getByRole("button", { name: "Add Wishlist" }));

    expect(await screen.findByText("New Wishlist")).toBeInTheDocument();
  });

  test("shows owned and shared wishlists in separate sections", async () => {
    const sharedWishlist = {
      ...mockWishlist,
      id: "2",
      name: "Shared Wishlist",
      role: "viewer" as const,
    };

    vi.mocked(getWishlists).mockResolvedValue([mockWishlist, sharedWishlist]);
    renderWithClient(<Dashboard />);

    await screen.findByText("My Wishlists");

    expect(screen.getByText("My Wishlists")).toBeInTheDocument();
    expect(screen.getByText("Shared with me")).toBeInTheDocument();
    expect(screen.getByText("My Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Shared Wishlist")).toBeInTheDocument();
  });

  test("shows loading state", () => {
    vi.mocked(getWishlists).mockReturnValue(new Promise(() => {}));
    renderWithClient(<Dashboard />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("shows error state", async () => {
    vi.mocked(getWishlists).mockRejectedValue(new Error("Failed"));
    renderWithClient(<Dashboard />);

    expect(
      await screen.findByText("Something went wrong."),
    ).toBeInTheDocument();
  });
});
