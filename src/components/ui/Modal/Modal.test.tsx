import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  const mockChildren = <p>Test</p>;

  test("renders children", () => {
    const mockOnClose = vi.fn();

    render(<Modal onClose={mockOnClose} children={mockChildren} />);

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("close modal on button", async () => {
    const mockOnClose = vi.fn();

    render(<Modal onClose={mockOnClose} children={mockChildren} />);

    expect(screen.getByText("Test")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("modal-close-button"));

    expect(mockOnClose).toHaveBeenCalled();
  });

  test("close modal when backdrop clicked", async () => {
    const mockOnClose = vi.fn();

    render(<Modal onClose={mockOnClose} children={mockChildren} />);

    expect(screen.getByText("Test")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("modal-backdrop"));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
