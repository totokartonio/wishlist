import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { Wishlist } from "./Wishlist";

vi.mock("../../data", () => ({
  items: [
    {
      id: "1",
      name: "Existing Item",
      price: "50$",
      link: "https://example.de",
      image: "Image",
      status: "want" as const,
    },
  ],
}));

describe("Wishlist", () => {
  test("renders wishlist with initial items", () => {
    render(<Wishlist />);

    expect(screen.getByText("Wishlist")).toBeInTheDocument();
    expect(screen.getByTestId("wishlist-add-button")).toBeInTheDocument();
    expect(screen.getByText("Existing Item")).toBeInTheDocument();
  });

  test("opens modal when Add Item button clicked", async () => {
    const user = userEvent.setup();

    render(<Wishlist />);

    const addButton = screen.getByTestId("wishlist-add-button");
    await user.click(addButton);

    expect(screen.getByText("New Item")).toBeInTheDocument();
  });

  test("adds new item when form submitted", async () => {
    const user = userEvent.setup();

    render(<Wishlist />);

    await user.click(screen.getByTestId("wishlist-add-button"));

    await user.type(
      screen.getByTestId("add-item-modal-name-input"),
      "New Headphones",
    );
    await user.type(screen.getByTestId("add-item-modal-price-input"), "150$");
    await user.type(
      screen.getByTestId("add-item-modal-link-input"),
      "https://new.de",
    );

    await user.click(screen.getByTestId("add-item-modal-submit-button"));

    expect(screen.getByText("New Headphones")).toBeInTheDocument();
    expect(screen.getByText("150$")).toBeInTheDocument();

    expect(screen.queryByText("New Item")).not.toBeInTheDocument();
  });

  test("opens edit modal when edit button clicked", async () => {
    const user = userEvent.setup();

    render(<Wishlist />);

    const editButtons = screen.getAllByTestId("items-table-edit-button");
    await user.click(editButtons[0]);

    expect(screen.getByText("Edit Item")).toBeInTheDocument();
    expect(screen.getByTestId("add-item-modal-name-input")).toHaveValue(
      "Existing Item",
    );
  });

  test("updates item when edit form submitted", async () => {
    const user = userEvent.setup();

    render(<Wishlist />);

    const editButtons = screen.getAllByTestId("items-table-edit-button");
    await user.click(editButtons[0]);

    const nameInput = screen.getByTestId("add-item-modal-name-input");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Item");

    await user.click(screen.getByTestId("add-item-modal-submit-button"));

    expect(screen.getByText("Updated Item")).toBeInTheDocument();
    expect(screen.queryByText("Existing Item")).not.toBeInTheDocument();

    expect(screen.queryByText("Edit Item")).not.toBeInTheDocument();
  });

  test("deletes item when delete button clicked", async () => {
    const user = userEvent.setup();

    render(<Wishlist />);

    expect(screen.getByText("Existing Item")).toBeInTheDocument();

    const deleteButtons = screen.getAllByTestId("items-table-delete-button");
    await user.click(deleteButtons[0]);

    expect(screen.queryByText("Existing Item")).not.toBeInTheDocument();
  });

  test("closes modal when cancel button clicked", async () => {
    const user = userEvent.setup();

    render(<Wishlist />);

    await user.click(screen.getByTestId("wishlist-add-button"));
    expect(screen.getByText("New Item")).toBeInTheDocument();

    const closeButton = screen.getByTestId("modal-close-button");

    await user.click(closeButton);
    expect(screen.queryByText("New Item")).not.toBeInTheDocument();
  });

  test("closes modal when backdrop clicked", async () => {
    const user = userEvent.setup();

    render(<Wishlist />);

    await user.click(screen.getByTestId("wishlist-add-button"));
    expect(screen.getByText("New Item")).toBeInTheDocument();

    const backdrop = screen.getByTestId("modal-backdrop");
    await user.click(backdrop);

    expect(screen.queryByText("New Item")).not.toBeInTheDocument();
  });

  test("renders table with correct headers", () => {
    render(<Wishlist />);

    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Link")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
});
