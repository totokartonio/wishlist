import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { AddItemModal } from "./AddItemModal";

describe("AddItemModal", () => {
  test("fields appear empty", () => {
    render(
      <AddItemModal onAdd={vi.fn()} onUpdate={vi.fn()} onClose={vi.fn()} />,
    );

    expect(screen.getByTestId("add-item-modal-name-input")).toHaveValue("");
    expect(screen.getByTestId("add-item-modal-price-input")).toHaveValue(null);
    expect(screen.getByTestId("add-item-modal-currency-select")).toHaveValue(
      "",
    );
    expect(screen.getByTestId("add-item-modal-link-input")).toHaveValue("");
  });

  test("can't submit empty form", async () => {
    const user = userEvent.setup();

    render(
      <AddItemModal onAdd={vi.fn()} onUpdate={vi.fn()} onClose={vi.fn()} />,
    );

    await user.click(screen.getByTestId("add-item-modal-submit-button"));

    const errorMessage = screen.getByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Please fill all fields");
  });

  test("clear error on blur", async () => {
    const user = userEvent.setup();

    render(
      <AddItemModal onAdd={vi.fn()} onUpdate={vi.fn()} onClose={vi.fn()} />,
    );

    await user.click(screen.getByTestId("add-item-modal-submit-button"));

    const errorMessage = screen.getByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();

    await user.click(screen.getByTestId("add-item-modal-name-input"));
    await user.tab();
    expect(errorMessage).not.toBeInTheDocument();
  });

  test("add new item on submit", async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    const mockOnClose = vi.fn();

    render(
      <AddItemModal
        onAdd={mockOnAdd}
        onUpdate={vi.fn()}
        onClose={mockOnClose}
      />,
    );

    await user.type(
      screen.getByTestId("add-item-modal-name-input"),
      "Sony headphones",
    );
    await user.type(screen.getByTestId("add-item-modal-price-input"), "100");
    await user.selectOptions(
      screen.getByTestId("add-item-modal-currency-select"),
      "USD",
    );
    await user.type(
      screen.getByTestId("add-item-modal-link-input"),
      "https://amazon.de",
    );
    await user.click(screen.getByTestId("add-item-modal-submit-button"));

    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Sony headphones",
        price: 100,
        currency: "USD",
        link: "https://amazon.de",
        status: "want",
      }),
    );

    expect(screen.getByTestId("add-item-modal-name-input")).toHaveValue("");
    expect(screen.getByTestId("add-item-modal-price-input")).toHaveValue(null);
    expect(screen.getByTestId("add-item-modal-currency-select")).toHaveValue(
      "",
    );
    expect(screen.getByTestId("add-item-modal-link-input")).toHaveValue("");
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("edit item on submit", async () => {
    const user = userEvent.setup();
    const mockOnUpdate = vi.fn();
    const mockOnAdd = vi.fn();
    const mockOnClose = vi.fn();

    const existingItem = {
      id: "123",
      name: "Old Name",
      price: 50,
      currency: "USD" as const,
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

    expect(screen.getByTestId("add-item-modal-name-input")).toHaveValue(
      "Old Name",
    );
    expect(screen.getByTestId("add-item-modal-price-input")).toHaveValue(50);
    expect(screen.getByTestId("add-item-modal-currency-select")).toHaveValue(
      "USD",
    );
    expect(screen.getByTestId("add-item-modal-link-input")).toHaveValue(
      "https://old.de",
    );

    await user.clear(screen.getByTestId("add-item-modal-name-input"));
    await user.type(
      screen.getByTestId("add-item-modal-name-input"),
      "New Name",
    );
    await user.selectOptions(
      screen.getByTestId("add-item-modal-currency-select"),
      "EUR",
    );
    await user.click(screen.getByTestId("add-item-modal-submit-button"));

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "New Name",
        price: 50,
        currency: "EUR",
        link: "https://old.de",
        status: "want",
      }),
    );

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
