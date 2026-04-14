import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Wishlist } from "./Wishlist";
import { renderWithClient } from "../../test/utils";
import { getItems } from "../../api/items";
import { deleteItem, updateItem, createItem } from "../../api/items";

const mockItem = {
  id: "1",
  name: "Existing Item",
  price: 50,
  currency: "USD" as const,
  link: "https://example.de",
  image: "Image",
  status: "want" as const,
};

vi.mock("../../api/items");
beforeEach(() => {
  vi.mocked(getItems).mockResolvedValue([mockItem]);
  vi.mocked(deleteItem).mockResolvedValue(undefined);
  vi.mocked(updateItem).mockResolvedValue(mockItem);
  vi.mocked(createItem).mockResolvedValue(mockItem);
});

describe("Wishlist", () => {
  test("renders wishlist with initial items", async () => {
    renderWithClient(<Wishlist wishlistId="test-wishlist-id" />);

    await screen.findByText("Wishlist");

    expect(screen.getByText("Wishlist")).toBeInTheDocument();
    expect(screen.getByTestId("wishlist-add-button")).toBeInTheDocument();
    expect(await screen.findByText("Existing Item")).toBeInTheDocument();
  });

  test("opens modal when Add Item button clicked", async () => {
    const user = userEvent.setup();

    renderWithClient(<Wishlist wishlistId="test-wishlist-id" />);

    await screen.findByText("Wishlist");

    const addButton = screen.getByTestId("wishlist-add-button");
    await user.click(addButton);

    expect(screen.getByText("New Item")).toBeInTheDocument();
  });

  test("adds new item when form submitted", async () => {
    const newItem = {
      id: "2",
      name: "New Headphones",
      price: 150,
      currency: "EUR" as const,
      link: "https://new.de",
      image: "Image",
      status: "want" as const,
    };

    vi.mocked(createItem).mockResolvedValue(newItem);
    vi.mocked(getItems)
      .mockResolvedValueOnce([mockItem])
      .mockResolvedValueOnce([mockItem, newItem]);

    const user = userEvent.setup();
    renderWithClient(<Wishlist wishlistId="test-wishlist-id" />);
    await screen.findByText("Wishlist");

    await user.click(screen.getByTestId("wishlist-add-button"));
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

    expect(await screen.findByText("New Headphones")).toBeInTheDocument();
    expect(screen.getByText("€150")).toBeInTheDocument();
    expect(screen.queryByText("New Item")).not.toBeInTheDocument();
  });

  test("updates item when edit form submitted", async () => {
    const updatedItem = { ...mockItem, name: "Updated Item" };

    vi.mocked(updateItem).mockResolvedValue(updatedItem);
    vi.mocked(getItems)
      .mockResolvedValueOnce([mockItem])
      .mockResolvedValueOnce([updatedItem]);

    const user = userEvent.setup();
    renderWithClient(<Wishlist wishlistId="test-wishlist-id" />);
    await screen.findByText("Wishlist");

    const editButtons = screen.getAllByTestId("items-table-edit-button");
    await user.click(editButtons[0]);

    const nameInput = screen.getByTestId("add-item-modal-name-input");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Item");
    await user.click(screen.getByTestId("add-item-modal-submit-button"));

    expect(await screen.findByText("Updated Item")).toBeInTheDocument();
    expect(screen.queryByText("Existing Item")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit Item")).not.toBeInTheDocument();
  });

  test("deletes item when delete button clicked", async () => {
    vi.mocked(getItems)
      .mockResolvedValueOnce([mockItem]) // initial fetch
      .mockResolvedValueOnce([]); // after deletion

    vi.mocked(deleteItem).mockResolvedValue(undefined);

    const user = userEvent.setup();
    renderWithClient(<Wishlist wishlistId="test-wishlist-id" />);
    await screen.findByText("Wishlist");

    const deleteButtons = screen.getAllByTestId("items-table-delete-button");
    await user.click(deleteButtons[0]);

    await screen.findByRole("table"); // wait for refetch
    expect(screen.queryByText("Existing Item")).not.toBeInTheDocument();
  });

  test("closes modal when cancel button clicked", async () => {
    const user = userEvent.setup();

    renderWithClient(<Wishlist wishlistId="test-wishlist-id" />);

    await screen.findByText("Wishlist");

    await user.click(screen.getByTestId("wishlist-add-button"));
    expect(screen.getByText("New Item")).toBeInTheDocument();

    const closeButton = screen.getByTestId("modal-close-button");

    await user.click(closeButton);
    expect(screen.queryByText("New Item")).not.toBeInTheDocument();
  });

  test("closes modal when backdrop clicked", async () => {
    const user = userEvent.setup();

    renderWithClient(<Wishlist wishlistId="test-wishlist-id" />);

    await screen.findByText("Wishlist");

    await user.click(screen.getByTestId("wishlist-add-button"));
    expect(screen.getByText("New Item")).toBeInTheDocument();

    const backdrop = screen.getByTestId("modal-backdrop");
    await user.click(backdrop);

    expect(screen.queryByText("New Item")).not.toBeInTheDocument();
  });

  test("renders table with correct headers", async () => {
    renderWithClient(<Wishlist wishlistId="test-wishlist-id" />);

    await screen.findByText("Wishlist");

    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Link")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("changes item status", async () => {
    vi.mocked(getItems)
      .mockResolvedValueOnce([mockItem])
      .mockResolvedValueOnce([{ ...mockItem, status: "bought" }]);

    const user = userEvent.setup();
    renderWithClient(<Wishlist wishlistId="test-wishlist-id" />);
    await screen.findByText("Wishlist");

    const statusSelects = screen.getAllByTestId("items-table-status");
    expect(statusSelects[0]).toHaveValue("want");

    await user.selectOptions(statusSelects[0], "bought");

    const updatedSelect = await screen.findByTestId("items-table-status");
    expect(updatedSelect).toHaveValue("bought");
  });
});
