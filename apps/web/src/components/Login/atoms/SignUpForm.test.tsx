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

const renderSignUpForm = (props = {}) => {
  return render(<SignUpForm {...defaultProps} {...props} />);
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SignUpForm", () => {
  test("show log in form", () => {
    renderSignUpForm();

    expect(
      screen.getByRole("form", { name: "Sign up form" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByLabelText("Name:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.getByTestId("show-password")).toBeInTheDocument();
    expect(screen.getByTestId("change-mode")).toBeInTheDocument();
  });

  test("show field errors", () => {
    renderSignUpForm({
      fieldErrors: {
        email: "Email error",
        password: "Password error",
        name: "Name error",
      },
    });

    const rows = screen.getAllByRole("alert");
    expect(rows).toHaveLength(3);
  });

  test("calls onChange when typing", async () => {
    renderSignUpForm();

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email:"), "test@test.com");
    expect(mockOnChange).toBeCalled();

    await user.type(screen.getByTestId("password-input"), "password");
    expect(mockOnChange).toBeCalled();

    await user.type(screen.getByLabelText("Name:"), "name");
    expect(mockOnChange).toBeCalled();
  });

  test("calls onBlur when leaving field", async () => {
    renderSignUpForm();

    const user = userEvent.setup();

    await user.tab();
    await user.tab();
    expect(mockOnBlur).toBeCalled();
  });

  test("calls onSubmit when form submitted", async () => {
    renderSignUpForm({
      email: "test@test",
      password: "password",
      name: "John Smith",
    });

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(mockOnSubmit).toBeCalled();
  });

  test("calls onChangeMode when 'Sign in' clicked", async () => {
    renderSignUpForm();

    const user = userEvent.setup();

    await user.click(screen.getByTestId("change-mode"));
    expect(mockOnChangeMode).toBeCalled();
  });

  test("toggles password visibility", async () => {
    renderSignUpForm();

    const user = userEvent.setup();
    const passwordInput = screen.getByTestId("password-input");
    const toggleButton = screen.getByTestId("show-password");

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
