import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { WishlistModal } from "./WishlistModal";

const mockOnAdd = vi.fn();
const mockOnUpdate = vi.fn();
const mockOnClose = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

const mockWishlist = {
  id: "1",
  name: "My Wishlist",
  description: "Test description",
  visibility: "public" as const,
  ownerId: "user1",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  hideClaimsFromOwner: true,
};

describe("WishlistModal", () => {
  describe("add mode", () => {
    test("fields appear empty when creating", () => {
      render(
        <WishlistModal mode="add" onAdd={mockOnAdd} onClose={mockOnClose} />,
      );

      expect(screen.getByLabelText("Name:")).toHaveValue("");
      expect(screen.getByLabelText("Description:")).toHaveValue("");
      expect(screen.getByLabelText("Who can see your wishlist?")).toHaveValue(
        "private",
      );
    });

    test("can't submit empty form", async () => {
      const user = userEvent.setup();
      render(
        <WishlistModal mode="add" onAdd={mockOnAdd} onClose={mockOnClose} />,
      );

      await user.click(screen.getByRole("button", { name: "Add Wishlist" }));

      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    test("calls onAdd with correct data", async () => {
      const user = userEvent.setup();
      render(
        <WishlistModal mode="add" onAdd={mockOnAdd} onClose={mockOnClose} />,
      );

      await user.type(screen.getByLabelText("Name:"), "New Wishlist");
      await user.type(screen.getByLabelText("Description:"), "A description");
      await user.selectOptions(
        screen.getByLabelText("Who can see your wishlist?"),
        "public",
      );
      await user.click(screen.getByRole("button", { name: "Add Wishlist" }));

      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New Wishlist",
          description: "A description",
          visibility: "public",
          hideClaimsFromOwner: true,
        }),
      );
      expect(mockOnClose).toHaveBeenCalled();
    });

    test("calls onClose when modal closed", async () => {
      const user = userEvent.setup();
      render(
        <WishlistModal mode="add" onAdd={mockOnAdd} onClose={mockOnClose} />,
      );

      await user.click(screen.getByTestId("modal-close-button"));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("edit mode", () => {
    test("fields pre-filled when editing", () => {
      render(
        <WishlistModal
          mode="edit"
          wishlist={mockWishlist}
          onUpdate={mockOnUpdate}
          onClose={mockOnClose}
        />,
      );

      expect(screen.getByLabelText("Name:")).toHaveValue("My Wishlist");
      expect(screen.getByLabelText("Description:")).toHaveValue(
        "Test description",
      );
      expect(screen.getByLabelText("Who can see your wishlist?")).toHaveValue(
        "public",
      );
    });

    test("calls onUpdate with correct data", async () => {
      const user = userEvent.setup();
      render(
        <WishlistModal
          mode="edit"
          wishlist={mockWishlist}
          onUpdate={mockOnUpdate}
          onClose={mockOnClose}
        />,
      );

      const nameInput = screen.getByLabelText("Name:");
      await user.clear(nameInput);
      await user.type(nameInput, "New Name");
      await user.click(screen.getByRole("button", { name: "Save Changes" }));

      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New Name",
          description: "Test description",
          visibility: "public",
          hideClaimsFromOwner: true,
        }),
      );
    });

    test("calls onClose when modal closed", async () => {
      const user = userEvent.setup();
      render(
        <WishlistModal
          mode="edit"
          wishlist={mockWishlist}
          onUpdate={mockOnUpdate}
          onClose={mockOnClose}
        />,
      );

      await user.click(screen.getByTestId("modal-close-button"));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
