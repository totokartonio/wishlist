import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Header } from "./Header";

vi.mock("../../lib/auth-client", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

const mockNavigate = vi.fn();

import { useSession, signOut } from "../../lib/auth-client";

const mockSessionLoggedOut = {
  data: null,
  isPending: false,
  isRefetching: false,
  error: null,
  refetch: vi.fn(),
};

const mockSessionLoggedIn = {
  data: {
    user: {
      id: "1",
      name: "Test User",
      email: "test@test.com",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    session: {
      id: "1",
      userId: "1",
      token: "token",
      expiresAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  isPending: false,
  isRefetching: false,
  error: null,
  refetch: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Header", () => {
  test("renders logo", () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedOut);
    render(<Header />);

    expect(screen.getByText("Logo")).toBeInTheDocument();
  });

  test("shows login button when not logged in", () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedOut);
    render(<Header />);

    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Log out" }),
    ).not.toBeInTheDocument();
  });

  test("shows user name and logout button when logged in", () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedIn);
    render(<Header />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Log in" }),
    ).not.toBeInTheDocument();
  });

  test("clicking logout shows modal", async () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedIn);
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "Log out" }));
    expect(
      screen.getByRole("heading", { name: "Log out" }),
    ).toBeInTheDocument();
  });

  test("modal cancel closes without logging out", async () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedIn);
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "Log out" }));
    await user.click(screen.getByRole("button", { name: "No" }));

    expect(signOut).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("heading", { name: "Log out" }),
    ).not.toBeInTheDocument();
  });

  test("modal confirm calls signOut and navigates to /login", async () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedIn);
    vi.mocked(signOut).mockResolvedValue({});
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "Log out" }));
    await user.click(screen.getByRole("button", { name: "Yes" }));

    expect(signOut).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
  });
});
