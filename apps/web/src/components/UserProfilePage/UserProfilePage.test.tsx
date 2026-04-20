import { screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { UserProfilePage } from "./UserProfilePage";
import { renderWithClient } from "../../test/utils";
import { getUser, getUserWishlists } from "../../api/users";

vi.mock("../../api/users");
vi.mock("../../lib/auth-client", () => ({
  useSession: () => ({ data: { user: { id: "other-user" } } }),
}));
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  };
});

const mockUser = { id: "user-1", name: "Jane Doe" };
const mockWishlists = [
  {
    id: "w-1",
    name: "Birthday Wishlist",
    description: null,
    visibility: "public" as const,
    ownerId: "user-1",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

beforeEach(() => {
  vi.mocked(getUser).mockResolvedValue(mockUser);
  vi.mocked(getUserWishlists).mockResolvedValue(mockWishlists);
});

describe("UserProfilePage", () => {
  test("renders user name and wishlists", async () => {
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(await screen.findByText("Birthday Wishlist")).toBeInTheDocument();
  });

  test("shows loading state", () => {
    vi.mocked(getUser).mockReturnValue(new Promise(() => {}));
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("shows error state", async () => {
    vi.mocked(getUser).mockRejectedValue(new Error("Failed"));
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(
      await screen.findByText("Something went wrong."),
    ).toBeInTheDocument();
  });

  test("shows not found when user is null", async () => {
    vi.mocked(getUser).mockResolvedValue(null as any);
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(await screen.findByText("User doesn't exist")).toBeInTheDocument();
  });

  test("shows no wishlists message when wishlists are undefined", async () => {
    vi.mocked(getUserWishlists).mockResolvedValue(undefined as any);
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(await screen.findByText("No wishlists found")).toBeInTheDocument();
  });
});
