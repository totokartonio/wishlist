import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Login } from "./Login";

vi.mock("../../lib/auth-client", () => ({
  signIn: {
    email: vi.fn(),
  },
  signUp: {
    email: vi.fn(),
  },
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

const mockNavigate = vi.fn();

import { signIn, signUp } from "../../lib/auth-client";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Login", () => {
  test("renders sign-in form by default", () => {
    render(<Login />);
    expect(
      screen.getByRole("form", { name: "Sign in form" }),
    ).toBeInTheDocument();
  });

  test("switches to sign-up form when mode changes", async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByTestId("change-mode"));
    expect(
      screen.getByRole("form", { name: "Sign up form" }),
    ).toBeInTheDocument();
  });

  test("navigates to / on successful sign-in", async () => {
    vi.mocked(signIn.email).mockResolvedValue({ error: null, data: {} });

    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText("Email:"), "test@test.com");
    await user.type(screen.getByTestId("password-input"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
  });

  test("shows error message on failed sign-in", async () => {
    vi.mocked(signIn.email).mockResolvedValue({
      error: { message: "Invalid credentials" },
      data: null,
    });

    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText("Email:"), "test@test.com");
    await user.type(screen.getByTestId("password-input"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  test("shows success message after sign-up", async () => {
    vi.mocked(signUp.email).mockResolvedValue({ error: null, data: {} });

    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByTestId("change-mode"));

    await user.type(screen.getByLabelText("Name:"), "John Smith");
    await user.type(screen.getByLabelText("Email:"), "test@test.com");
    await user.type(screen.getByTestId("password-input"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(
      await screen.findByText("Account created! Please sign in."),
    ).toBeInTheDocument();
  });

  test("shows error message on failed sign-up", async () => {
    vi.mocked(signUp.email).mockResolvedValue({
      error: { message: "Email already exists" },
      data: null,
    });

    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByTestId("change-mode"));

    await user.type(screen.getByLabelText("Name:"), "John Smith");
    await user.type(screen.getByLabelText("Email:"), "test@test.com");
    await user.type(screen.getByTestId("password-input"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(await screen.findByText("Email already exists")).toBeInTheDocument();
  });
});
