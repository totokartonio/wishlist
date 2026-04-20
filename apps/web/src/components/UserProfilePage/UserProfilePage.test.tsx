import { screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { UserProfilePage } from "./UserProfilePage";
import { renderWithClient } from "../../test/utils";
import { getUser, getUserWishlists } from "../../api/users";
import type { UserProfile, Wishlist } from "@wishlist/types";

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

const mockUser: UserProfile = { id: "user-1", name: "Jane Doe" };
const mockWishlists: Wishlist[] = [
  {
    id: "w-1",
    name: "Birthday Wishlist",
    description: null,
    visibility: "public",
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
    vi.mocked(getUser).mockResolvedValue(
      null as unknown as ReturnType<typeof getUser> extends Promise<infer T>
        ? T
        : never,
    );
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(await screen.findByText("User doesn't exist")).toBeInTheDocument();
  });

  test("shows not found when user is null", async () => {
    vi.mocked(getUser).mockResolvedValue(null as unknown as UserProfile);
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(await screen.findByText("User doesn't exist")).toBeInTheDocument();
  });

  test("shows no wishlists message when wishlists are undefined", async () => {
    vi.mocked(getUserWishlists).mockResolvedValue(
      undefined as unknown as Wishlist[],
    );
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(await screen.findByText("No wishlists found")).toBeInTheDocument();
  });
});
