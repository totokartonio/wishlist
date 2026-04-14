import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { AddWishlistModal } from "./AddWishlistModal";

describe("AddWishlistModal", () => {
  const mockOnAdd = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    onAdd: mockOnAdd,
    onUpdate: mockOnUpdate,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("fields appear empty when creating", () => {
    render(<AddWishlistModal {...defaultProps} />);

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByLabelText("Visibility")).toHaveValue("private");
  });

  test("fields pre-filled when editing", () => {
    const existingWishlist = {
      id: "1",
      name: "My Wishlist",
      description: "Test description",
      visibility: "public" as const,
      ownerId: "user1",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    render(<AddWishlistModal {...defaultProps} wishlist={existingWishlist} />);

    expect(screen.getByLabelText("Name")).toHaveValue("My Wishlist");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "Test description",
    );
    expect(screen.getByLabelText("Visibility")).toHaveValue("public");
  });

  test("can't submit empty form", async () => {
    const user = userEvent.setup();
    render(<AddWishlistModal {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Add Wishlist" }));

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test("calls onAdd with correct data when creating", async () => {
    const user = userEvent.setup();
    render(<AddWishlistModal {...defaultProps} />);

    await user.type(screen.getByLabelText("Name"), "New Wishlist");
    await user.type(screen.getByLabelText("Description"), "A description");
    await user.selectOptions(screen.getByLabelText("Visibility"), "public");
    await user.click(screen.getByRole("button", { name: "Add Wishlist" }));

    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "New Wishlist",
        description: "A description",
        visibility: "public",
      }),
    );
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("calls onUpdate with correct data when editing", async () => {
    const user = userEvent.setup();
    const existingWishlist = {
      id: "1",
      name: "Old Name",
      description: "Old description",
      visibility: "private" as const,
      ownerId: "user1",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    render(<AddWishlistModal {...defaultProps} wishlist={existingWishlist} />);

    const nameInput = screen.getByLabelText("Name");
    await user.clear(nameInput);
    await user.type(nameInput, "New Name");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "New Name",
        description: "Old description",
        visibility: "private",
      }),
    );
    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("calls onClose when modal closed", async () => {
    const user = userEvent.setup();
    render(<AddWishlistModal {...defaultProps} />);

    await user.click(screen.getByTestId("modal-close-button"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
