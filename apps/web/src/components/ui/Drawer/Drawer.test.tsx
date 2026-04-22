import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { Drawer } from "./Drawer";

describe("Drawer", () => {
  test("renders children", () => {
    render(<Drawer onClose={vi.fn()}>Drawer content</Drawer>);
    expect(screen.getByText("Drawer content")).toBeInTheDocument();
  });

  test("renders close button", () => {
    render(<Drawer onClose={vi.fn()}>Content</Drawer>);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  test("calls onClose when backdrop clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Drawer onClose={onClose}>Content</Drawer>);

    await user.click(screen.getByTestId("modal-backdrop"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  test("calls onClose when close button clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Drawer onClose={onClose}>Content</Drawer>);

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
