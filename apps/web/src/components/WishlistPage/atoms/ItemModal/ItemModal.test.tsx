import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { ItemModal } from "./ItemModal";
import type { Item } from "@wishlist/types";

vi.mock("../../../ui/Modal", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const existingItem: Item = {
  id: "123",
  name: "Old Name",
  price: 50,
  currency: "USD",
  link: "https://old.de",
  image: "Image",
  status: "want",
  archived: false,
  claimedByUserId: null,
};

describe("ItemModal", () => {
  describe("add mode", () => {
    test("fields appear empty", () => {
      render(<ItemModal mode="add" onAdd={vi.fn()} onClose={vi.fn()} />);

      expect(screen.getByTestId("add-item-modal-name-input")).toHaveValue("");
      expect(screen.getByTestId("add-item-modal-price-input")).toHaveValue(
        null,
      );
      expect(screen.getByTestId("add-item-modal-currency-select")).toHaveValue(
        "",
      );
      expect(screen.getByTestId("add-item-modal-link-input")).toHaveValue("");
    });

    test("can't submit empty form", async () => {
      const user = userEvent.setup();
      render(<ItemModal mode="add" onAdd={vi.fn()} onClose={vi.fn()} />);

      await user.click(screen.getByTestId("add-item-modal-submit-button"));

      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Please fill all fields",
      );
    });

    test("clears error on blur", async () => {
      const user = userEvent.setup();
      render(<ItemModal mode="add" onAdd={vi.fn()} onClose={vi.fn()} />);

      await user.click(screen.getByTestId("add-item-modal-submit-button"));
      expect(screen.getByTestId("error-message")).toBeInTheDocument();

      await user.click(screen.getByTestId("add-item-modal-name-input"));
      await user.tab();
      expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    });

    test("calls onAdd with correct data on submit", async () => {
      const user = userEvent.setup();
      const mockOnAdd = vi.fn();
      const mockOnClose = vi.fn();

      render(<ItemModal mode="add" onAdd={mockOnAdd} onClose={mockOnClose} />);

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
      expect(mockOnClose).toHaveBeenCalled();
    });

    test("resets fields after successful add", async () => {
      const user = userEvent.setup();

      render(<ItemModal mode="add" onAdd={vi.fn()} onClose={vi.fn()} />);

      await user.type(
        screen.getByTestId("add-item-modal-name-input"),
        "Sony headphones",
      );
      await user.click(screen.getByTestId("add-item-modal-submit-button"));

      expect(screen.getByTestId("add-item-modal-name-input")).toHaveValue("");
    });
  });

  describe("edit mode", () => {
    test("fields pre-filled with existing item data", () => {
      render(
        <ItemModal
          mode="edit"
          item={existingItem}
          onUpdate={vi.fn()}
          onClose={vi.fn()}
          canEdit={true}
          onResetClaim={vi.fn()}
          onArchive={vi.fn()}
          onUnarchive={vi.fn()}
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
    });

    test("calls onUpdate with correct data on submit", async () => {
      const user = userEvent.setup();
      const mockOnUpdate = vi.fn();
      const mockOnClose = vi.fn();

      render(
        <ItemModal
          mode="edit"
          item={existingItem}
          onUpdate={mockOnUpdate}
          onClose={mockOnClose}
          canEdit={true}
          onResetClaim={vi.fn()}
          onArchive={vi.fn()}
          onUnarchive={vi.fn()}
        />,
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
        }),
      );
      expect(mockOnClose).toHaveBeenCalled();
    });

    test("shows archive and reset claim buttons when canEdit is true", () => {
      render(
        <ItemModal
          mode="edit"
          item={existingItem}
          onUpdate={vi.fn()}
          onClose={vi.fn()}
          canEdit={true}
          onResetClaim={vi.fn()}
          onArchive={vi.fn()}
          onUnarchive={vi.fn()}
        />,
      );

      expect(
        screen.getByRole("button", { name: "Reset claim" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Archive" }),
      ).toBeInTheDocument();
    });

    test("hides archive and reset claim buttons when canEdit is false", () => {
      render(
        <ItemModal
          mode="edit"
          item={existingItem}
          onUpdate={vi.fn()}
          onClose={vi.fn()}
          canEdit={false}
          onResetClaim={vi.fn()}
          onArchive={vi.fn()}
          onUnarchive={vi.fn()}
        />,
      );

      expect(
        screen.queryByRole("button", { name: "Reset claim" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Archive" }),
      ).not.toBeInTheDocument();
    });

    test("shows confirmation when Reset claim clicked", async () => {
      const user = userEvent.setup();

      render(
        <ItemModal
          mode="edit"
          item={existingItem}
          onUpdate={vi.fn()}
          onClose={vi.fn()}
          canEdit={true}
          onResetClaim={vi.fn()}
          onArchive={vi.fn()}
          onUnarchive={vi.fn()}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Reset claim" }));

      expect(
        screen.getByText("This will release the current claim. Are you sure?"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Yes, release claim" }),
      ).toBeInTheDocument();
    });

    test("calls onResetClaim when confirmed", async () => {
      const user = userEvent.setup();
      const mockOnResetClaim = vi.fn();

      render(
        <ItemModal
          mode="edit"
          item={existingItem}
          onUpdate={vi.fn()}
          onClose={vi.fn()}
          canEdit={true}
          onResetClaim={mockOnResetClaim}
          onArchive={vi.fn()}
          onUnarchive={vi.fn()}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Reset claim" }));
      await user.click(
        screen.getByRole("button", { name: "Yes, release claim" }),
      );

      expect(mockOnResetClaim).toHaveBeenCalledOnce();
    });

    test("shows Unarchive button for archived item", () => {
      render(
        <ItemModal
          mode="edit"
          item={{ ...existingItem, archived: true }}
          onUpdate={vi.fn()}
          onClose={vi.fn()}
          canEdit={true}
          onResetClaim={vi.fn()}
          onArchive={vi.fn()}
          onUnarchive={vi.fn()}
        />,
      );

      expect(
        screen.getByRole("button", { name: "Unarchive" }),
      ).toBeInTheDocument();
    });
  });
});
