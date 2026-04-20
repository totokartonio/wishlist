import { screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { renderWithClient } from "../../test/utils";

const mockNavigate = vi.fn();

vi.mock("../../api/users", () => ({
  getUser: () => Promise.resolve({ id: "current-user", name: "Me" }),
  getUserWishlists: () => Promise.resolve([]),
}));

vi.mock("../../lib/auth-client", () => ({
  useSession: () => ({ data: { user: { id: "current-user" } } }),
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  };
});

describe("UserProfilePage redirect", () => {
  test("redirects to dashboard when viewing own profile", async () => {
    const { UserProfilePage } = await import("./UserProfilePage");
    renderWithClient(<UserProfilePage userId="current-user" />);

    await screen.findByText("Me");
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
  });
});
