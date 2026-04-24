import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { WishlistPage } from "./WishlistPage";
import { renderWithClient } from "../../test/utils";
import { getItems, deleteItem, updateItem, createItem } from "../../api/items";
import { getWishlist } from "../../api/wishlists";
import { getUser } from "../../api/users";
import { getCollaborators } from "../../api/collaborators";

const mockNavigate = vi.fn();

vi.mock("../../api/collaborators");
vi.mock("../../api/items");
vi.mock("../../api/wishlists");
vi.mock("../../api/users");

vi.mock("../../lib/auth-client", () => ({
  useSession: () => ({
    data: { user: { id: "user-1", name: "Test User" } },
  }),
  signIn: { anonymous: vi.fn() },
}));

vi.mock("./atoms/Sidebar", () => ({
  default: () => <div data-testid="wishlist-sidebar" />,
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockWishlist = {
  id: "test-wishlist-id",
  name: "Test Wishlist",
  description: null,
  visibility: "private" as const,
  ownerId: "user-1",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  role: "owner" as const,
  hideClaimsFromOwner: true,
};

const mockItem = {
  id: "1",
  name: "Existing Item",
  price: 50,
  currency: "USD" as const,
  link: "https://example.de",
  image: "Image",
  status: "want" as const,
  archived: false,
  claimedByUserId: null,
};

const renderWishlistPage = async () => {
  renderWithClient(<WishlistPage wishlistId="test-wishlist-id" />);

  await screen.findByText("Test Wishlist");
};

const openAddItemModal = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByTestId("wishlist-add-button"));

  return screen.findByTestId("add-item-modal-name-input");
};

const openEditItemModal = async (user: ReturnType<typeof userEvent.setup>) => {
  const editButton = await screen.findByTestId("items-table-edit-button");

  await user.click(editButton);

  return screen.findByTestId("add-item-modal-name-input");
};

beforeEach(() => {
  vi.clearAllMocks();

  /**
   * Keeps tests safe if Modal uses a portal root.
   * Harmless if your Modal renders directly into document.body.
   */
  document.body.innerHTML = '<div id="modal-root"></div>';

  vi.mocked(getItems).mockResolvedValue([mockItem]);
  vi.mocked(deleteItem).mockResolvedValue(undefined);
  vi.mocked(updateItem).mockResolvedValue(mockItem);
  vi.mocked(createItem).mockResolvedValue(mockItem);
  vi.mocked(getWishlist).mockResolvedValue(mockWishlist);
  vi.mocked(getUser).mockResolvedValue({ id: "user-1", name: "Test User" });
  vi.mocked(getCollaborators).mockResolvedValue([]);
});

describe("WishlistPage", () => {
  test("renders wishlist with initial items", async () => {
    await renderWishlistPage();

    expect(screen.getByText("Test Wishlist")).toBeInTheDocument();
    expect(screen.getByTestId("wishlist-add-button")).toBeInTheDocument();
    expect(await screen.findByText("Existing Item")).toBeInTheDocument();
  });

  test("opens add item modal when Add Wish button is clicked", async () => {
    const user = userEvent.setup();

    await renderWishlistPage();
    await openAddItemModal(user);

    expect(screen.getByTestId("add-item-modal-name-input")).toBeInTheDocument();
    expect(
      screen.getByTestId("add-item-modal-price-input"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("add-item-modal-currency-select"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("add-item-modal-link-input")).toBeInTheDocument();
    expect(
      screen.getByTestId("add-item-modal-submit-button"),
    ).toBeInTheDocument();
  });

  test("closes add item modal when backdrop is clicked", async () => {
    const user = userEvent.setup();

    await renderWishlistPage();
    await openAddItemModal(user);

    await user.click(screen.getByTestId("modal-backdrop"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("add-item-modal-name-input"),
      ).not.toBeInTheDocument();
    });
  });

  test("closes add item modal when close button is clicked", async () => {
    const user = userEvent.setup();

    await renderWishlistPage();
    await openAddItemModal(user);

    await user.click(screen.getByTestId("modal-close-button"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("add-item-modal-name-input"),
      ).not.toBeInTheDocument();
    });
  });

  test("renders table headers — actions visible, status hidden for owner in surprise mode", async () => {
    await renderWishlistPage();

    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Link")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.queryByText("Status")).not.toBeInTheDocument();
  });

  test("renders status column when owner has surprise mode off", async () => {
    vi.mocked(getWishlist).mockResolvedValue({
      ...mockWishlist,
      hideClaimsFromOwner: false,
    });

    await renderWishlistPage();

    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  test("adds new item when form is submitted", async () => {
    const user = userEvent.setup();

    const newItem = {
      ...mockItem,
      id: "2",
      name: "New Headphones",
      price: 150,
      currency: "EUR" as const,
      link: "https://new.de",
    };

    vi.mocked(createItem).mockResolvedValue(newItem);

    /**
     * This keeps the table updated after React Query invalidates/refetches.
     * If your mutation uses optimistic updates, this still works.
     */
    vi.mocked(getItems).mockResolvedValue([mockItem, newItem]);

    await renderWishlistPage();
    await openAddItemModal(user);

    await user.type(
      screen.getByTestId("add-item-modal-name-input"),
      "New Headphones",
    );

    await user.type(screen.getByTestId("add-item-modal-price-input"), "150");

    await user.selectOptions(
      screen.getByTestId("add-item-modal-currency-select"),
      "EUR",
    );

    await user.type(
      screen.getByTestId("add-item-modal-link-input"),
      "https://new.de",
    );

    await user.click(screen.getByTestId("add-item-modal-submit-button"));

    await waitFor(() => {
      expect(createItem).toHaveBeenCalled();
    });

    expect(await screen.findByText("New Headphones")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByTestId("add-item-modal-name-input"),
      ).not.toBeInTheDocument();
    });
  });

  test("opens edit item modal when edit button is clicked", async () => {
    const user = userEvent.setup();

    await renderWishlistPage();
    const nameInput = await openEditItemModal(user);

    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue("Existing Item");
  });

  test("updates item when edit form is submitted", async () => {
    const user = userEvent.setup();

    const updatedItem = {
      ...mockItem,
      name: "Updated Item",
    };

    vi.mocked(updateItem).mockResolvedValue(updatedItem);
    vi.mocked(getItems).mockResolvedValue([updatedItem]);

    await renderWishlistPage();

    const nameInput = await openEditItemModal(user);

    await user.clear(nameInput);
    await user.type(nameInput, "Updated Item");

    await user.click(screen.getByTestId("add-item-modal-submit-button"));

    await waitFor(() => {
      expect(updateItem).toHaveBeenCalled();
    });

    expect(await screen.findByText("Updated Item")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Existing Item")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("add-item-modal-name-input"),
      ).not.toBeInTheDocument();
    });
  });

  test("deletes item after confirmation", async () => {
    const user = userEvent.setup();

    /**
     * Initial render shows the item.
     * After deletion/refetch, the API returns an empty list.
     */
    vi.mocked(getItems).mockResolvedValueOnce([mockItem]).mockResolvedValue([]);

    await renderWishlistPage();

    const deleteButton = await screen.findByTestId("items-table-delete-button");

    await user.click(deleteButton);

    expect(await screen.findByText("Delete Wish?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /yes/i }));

    await waitFor(() => {
      expect(deleteItem).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.queryByText("Existing Item")).not.toBeInTheDocument();
    });
  });

  test("opens sidebar when manage button is clicked", async () => {
    const user = userEvent.setup();

    await renderWishlistPage();

    await user.click(screen.getByRole("button", { name: /manage/i }));

    expect(screen.getByTestId("wishlist-sidebar")).toBeInTheDocument();
  });
});
