import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { AddItemModal } from "./AddItemModal";

describe("AddItemModal", () => {
  test("fields appear empty", () => {
    const mockOnAdd = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnClose = vi.fn();

    render(
      <AddItemModal
        onAdd={mockOnAdd}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
      />,
    );

    const nameInput = screen.getByTestId("add-item-modal-name-input");
    const priceInput = screen.getByTestId("add-item-modal-price-input");
    const linkInput = screen.getByTestId("add-item-modal-link-input");

    expect(nameInput).toHaveValue("");
    expect(priceInput).toHaveValue("");
    expect(linkInput).toHaveValue("");
  });

  test("can't submit empty form", async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnClose = vi.fn();

    render(
      <AddItemModal
        onAdd={mockOnAdd}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
      />,
    );

    await user.click(screen.getByTestId("add-item-modal-submit-button"));

    const errorMessage = screen.getByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Please fill all fields");
  });

  test("clear error on blur", async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnClose = vi.fn();

    render(
      <AddItemModal
        onAdd={mockOnAdd}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
      />,
    );

    const nameInput = screen.getByTestId("add-item-modal-name-input");

    await user.click(screen.getByTestId("add-item-modal-submit-button"));

    const errorMessage = screen.getByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();

    await user.click(nameInput);
    await user.tab();
    expect(errorMessage).not.toBeInTheDocument();
  });

  test("add new item on submit", async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnClose = vi.fn();

    render(
      <AddItemModal
        onAdd={mockOnAdd}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
      />,
    );

    const nameInput = screen.getByTestId("add-item-modal-name-input");
    const priceInput = screen.getByTestId("add-item-modal-price-input");
    const linkInput = screen.getByTestId("add-item-modal-link-input");
    const submitButton = screen.getByTestId("add-item-modal-submit-button");

    await user.type(nameInput, "Sony headphones");
    await user.type(priceInput, "100$");
    await user.type(linkInput, "https://amazon.de");
    await user.click(submitButton);

    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Sony headphones",
        price: "100$",
        link: "https://amazon.de",
        status: "want",
      }),
    );

    expect(nameInput).toHaveValue("");
    expect(priceInput).toHaveValue("");
    expect(linkInput).toHaveValue("");

    expect(mockOnClose).toHaveBeenCalled();
  });

  test("edit item on submit", async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnClose = vi.fn();

    const existingItem = {
      id: "123",
      name: "Old Name",
      price: "50$",
      link: "https://old.de",
      image: "Image",
      status: "want" as const,
    };

    render(
      <AddItemModal
        item={existingItem}
        onAdd={mockOnAdd}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
      />,
    );

    const nameInput = screen.getByTestId("add-item-modal-name-input");
    const priceInput = screen.getByTestId("add-item-modal-price-input");
    const linkInput = screen.getByTestId("add-item-modal-link-input");

    expect(nameInput).toHaveValue("Old Name");
    expect(priceInput).toHaveValue("50$");
    expect(linkInput).toHaveValue("https://old.de");

    await user.clear(nameInput);
    await user.type(nameInput, "New Name");
    await user.click(screen.getByTestId("add-item-modal-submit-button"));

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "New Name",
        price: "50$",
        link: "https://old.de",
        status: "want",
      }),
    );

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
