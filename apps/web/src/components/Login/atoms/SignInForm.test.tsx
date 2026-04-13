import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { SignInForm } from "./SignInForm";

const mockOnSubmit = vi.fn();
const mockOnChange = vi.fn();
const mockOnBlur = vi.fn();
const mockOnChangeMode = vi.fn();

const defaultProps = {
  email: "",
  password: "",
  fieldErrors: { email: "", password: "" },
  onSubmit: mockOnSubmit,
  onChange: mockOnChange,
  onBlur: mockOnBlur,
  onChangeMode: mockOnChangeMode,
};

const renderSignInForm = (props = {}) => {
  return render(<SignInForm {...defaultProps} {...props} />);
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SignInForm", () => {
  test("show log in form", () => {
    renderSignInForm();

    expect(
      screen.getByRole("form", { name: "Sign in form" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByTestId("change-password")).toBeInTheDocument();
    expect(screen.getByTestId("change-mode")).toBeInTheDocument();
  });

  test("show field errors", () => {
    renderSignInForm({
      fieldErrors: {
        email: "Email error",
        password: "Password error",
      },
    });

    const rows = screen.getAllByRole("alert");
    expect(rows).toHaveLength(2);
  });

  test("calls onChange when typing", async () => {
    renderSignInForm();

    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email:"), "test@test.com");
    expect(mockOnChange).toBeCalled();

    await user.type(screen.getByLabelText("Password:"), "password");
    expect(mockOnChange).toBeCalled();
  });

  test("calls onBlur when leaving field", async () => {
    renderSignInForm();

    const user = userEvent.setup();

    await user.tab();
    await user.tab();
    expect(mockOnBlur).toBeCalled();
  });

  test("calls onSubmit when form submitted", async () => {
    renderSignInForm({ email: "test@test", password: "password" });

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(mockOnSubmit).toBeCalled();
  });

  test("calls onChangeMode when 'Sign up' clicked", async () => {
    renderSignInForm();

    const user = userEvent.setup();

    await user.click(screen.getByTestId("change-mode"));
    expect(mockOnChangeMode).toBeCalled();
  });
});
