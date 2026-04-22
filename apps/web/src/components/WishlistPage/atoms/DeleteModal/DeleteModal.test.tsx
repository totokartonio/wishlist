import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { DeleteModal } from "./DeleteModal";

vi.mock("../../../ui/Modal", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockOnClose = vi.fn();
const mockOnDelete = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("DeleteModal", () => {
  test("renders item delete message", () => {
    render(
      <DeleteModal
        mode="deleteItem"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );
    expect(screen.getByText(/delete this item/)).toBeInTheDocument();
  });

  test("renders wishlist delete message", () => {
    render(
      <DeleteModal
        mode="deleteWishlist"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );
    expect(screen.getByText(/delete this wishlist/)).toBeInTheDocument();
  });

  test("calls onDelete when Yes clicked", async () => {
    const user = userEvent.setup();
    render(
      <DeleteModal
        mode="deleteItem"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(mockOnDelete).toHaveBeenCalledOnce();
  });

  test("calls onClose when No clicked", async () => {
    const user = userEvent.setup();
    render(
      <DeleteModal
        mode="deleteItem"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );

    await user.click(screen.getByRole("button", { name: "No" }));
    expect(mockOnClose).toHaveBeenCalledOnce();
  });
});
