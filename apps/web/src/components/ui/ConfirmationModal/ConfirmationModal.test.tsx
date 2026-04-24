import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ConfirmationModal } from "./ConfirmationModal";

vi.mock("../Modal", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockOnClose = vi.fn();
const mockOnConfirm = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ConfirmationModal", () => {
  test("renders title and message", () => {
    render(
      <ConfirmationModal
        title="Delete Wish?"
        message="Are you sure you want to delete this wish?"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText("Delete Wish?")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this wish?"),
    ).toBeInTheDocument();
  });

  test("renders default confirm and cancel labels", () => {
    render(
      <ConfirmationModal
        title="Test"
        message="Test message"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument();
  });

  test("renders custom confirm and cancel labels", () => {
    render(
      <ConfirmationModal
        title="Test"
        message="Test message"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  test("calls onConfirm when confirm button clicked", async () => {
    const user = userEvent.setup();
    render(
      <ConfirmationModal
        title="Test"
        message="Test message"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(mockOnConfirm).toHaveBeenCalledOnce();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("calls onClose when cancel button clicked", async () => {
    const user = userEvent.setup();
    render(
      <ConfirmationModal
        title="Test"
        message="Test message"
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: "No" }));
    expect(mockOnClose).toHaveBeenCalledOnce();
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });
});
