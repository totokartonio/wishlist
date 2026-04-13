import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { LogOutModal } from "./LogOutModal";

const mockOnClose = vi.fn();
const mockOnLogout = vi.fn();

const defaultProps = {
  onClose: mockOnClose,
  onLogout: mockOnLogout,
};

const renderLogOutModal = (props = {}) => {
  return render(<LogOutModal {...defaultProps} {...props} />);
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LogOutModal", () => {
  test("renders heading, message and buttons", () => {
    renderLogOutModal();

    expect(screen.getByText("Log out")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to log out?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
  });

  test("calls onClose when No clicked", async () => {
    const user = userEvent.setup();
    renderLogOutModal();

    await user.click(screen.getByRole("button", { name: "No" }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnLogout).not.toHaveBeenCalled();
  });

  test("calls onLogout when Yes clicked", async () => {
    const user = userEvent.setup();
    renderLogOutModal();

    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
