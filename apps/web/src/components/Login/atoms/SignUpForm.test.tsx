import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { SignUpForm } from "./SignUpForm";

const mockOnSubmit = vi.fn();
const mockOnChange = vi.fn();
const mockOnBlur = vi.fn();
const mockOnChangeMode = vi.fn();

const defaultProps = {
  email: "",
  password: "",
  name: "",
  fieldErrors: { email: "", password: "", name: "" },
  onSubmit: mockOnSubmit,
  onChange: mockOnChange,
  onBlur: mockOnBlur,
  onChangeMode: mockOnChangeMode,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SignUpForm", () => {
  test("show sign up form", () => {
    render(<SignUpForm {...defaultProps} />);

    expect(
      screen.getByRole("form", { name: "Sign up form" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByLabelText("Name:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.getByTestId("show-password")).toBeInTheDocument();
    expect(screen.getByTestId("change-mode")).toBeInTheDocument();
  });

  test("show field errors", () => {
    render(
      <SignUpForm
        {...defaultProps}
        fieldErrors={{
          email: "Email error",
          password: "Password error",
          name: "Name error",
        }}
      />,
    );

    const alerts = screen.getAllByRole("alert");
    expect(alerts).toHaveLength(3);
  });

  test("calls onChange when typing", async () => {
    const user = userEvent.setup();
    render(<SignUpForm {...defaultProps} />);

    await user.type(screen.getByLabelText("Email:"), "test@test.com");
    expect(mockOnChange).toBeCalled();

    await user.type(screen.getByLabelText("Password:"), "password");
    expect(mockOnChange).toBeCalled();

    await user.type(screen.getByLabelText("Name:"), "name");
    expect(mockOnChange).toBeCalled();
  });

  test("calls onBlur when leaving field", async () => {
    const user = userEvent.setup();
    render(<SignUpForm {...defaultProps} />);

    await user.tab();
    await user.tab();
    expect(mockOnBlur).toBeCalled();
  });

  test("calls onSubmit when form submitted", async () => {
    const user = userEvent.setup();
    render(
      <SignUpForm
        {...defaultProps}
        email="test@test.com"
        password="password123"
        name="John Smith"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(mockOnSubmit).toBeCalled();
  });

  test("calls onChangeMode when 'Sign in' clicked", async () => {
    const user = userEvent.setup();
    render(<SignUpForm {...defaultProps} />);

    await user.click(screen.getByTestId("change-mode"));
    expect(mockOnChangeMode).toBeCalled();
  });

  test("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<SignUpForm {...defaultProps} />);

    const passwordInput = screen.getByLabelText("Password:");
    const toggleButton = screen.getByTestId("show-password");

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
