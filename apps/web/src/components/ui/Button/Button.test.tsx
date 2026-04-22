import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  test("renders children", () => {
    render(
      <Button variant="raised" color="primary">
        Click me
      </Button>,
    );
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  test("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button variant="raised" color="primary" onClick={onClick}>
        Click
      </Button>,
    );

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  test("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button variant="raised" color="primary" onClick={onClick} disabled>
        Click
      </Button>,
    );

    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  test("renders as submit button", () => {
    render(
      <Button variant="raised" color="primary" type="submit">
        Submit
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  test("applies sm size", () => {
    render(
      <Button variant="raised" color="primary" size="sm">
        Small
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("sm"),
    );
  });

  test("applies md size by default", () => {
    render(
      <Button variant="raised" color="primary">
        Default
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("md"),
    );
  });

  test("applies ghost variant", () => {
    render(
      <Button variant="ghost" color="primary">
        Ghost
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("ghost"),
    );
  });

  test("applies secondary color", () => {
    render(
      <Button variant="raised" color="secondary">
        Secondary
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("secondary"),
    );
  });

  test("applies additional className", () => {
    render(
      <Button variant="raised" color="primary" className="extra">
        Extra
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "class",
      expect.stringContaining("extra"),
    );
  });
});
