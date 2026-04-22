import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  test("renders label and input", () => {
    render(<Input id="test" label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  test("label is connected to input via htmlFor", () => {
    render(<Input id="test-id" label="Name" />);
    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("id", "test-id");
  });

  test("shows error message when error provided", () => {
    render(<Input id="test" label="Email" error="Email is required" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  test("does not show error message when no error", () => {
    render(<Input id="test" label="Email" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("input has aria-describedby when error provided", () => {
    render(<Input id="test" label="Email" error="Required" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-describedby",
      "test-error",
    );
  });

  test("calls onChange when typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input id="test" label="Name" onChange={onChange} />);

    await user.type(screen.getByLabelText("Name"), "hello");
    expect(onChange).toHaveBeenCalled();
  });

  test("renders rightElement when provided", () => {
    render(
      <Input
        id="test"
        label="Password"
        rightElement={<button>Toggle</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Toggle" })).toBeInTheDocument();
  });

  test("is disabled when disabled prop passed", () => {
    render(<Input id="test" label="Email" disabled />);
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });
});
