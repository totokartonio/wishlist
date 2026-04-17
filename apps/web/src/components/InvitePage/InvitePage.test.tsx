import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { InvitePage } from "./InvitePage";
import { renderWithClient } from "../../test/utils";
import { useInvite } from "../../hooks/invites/useInvite";
import { useJoinInvite } from "../../hooks/invites/useJoinInvite";
import { useSession } from "../../lib/auth-client";

vi.mock("../../hooks/invites/useInvite");
vi.mock("../../hooks/invites/useJoinInvite");
vi.mock("../../lib/auth-client");
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
const mockJoin = vi.fn();

const mockInvite = {
  id: "invite-1",
  token: "test-token",
  wishlistId: "wishlist-1",
  expiresAt: "2099-01-01",
  createdAt: "2024-01-01",
  url: "http://localhost:5173/invites/test-token",
  wishlist: {
    id: "wishlist-1",
    name: "Test Wishlist",
    description: "A test wishlist",
    visibility: "invite" as const,
  },
};

const mockSession = {
  data: {
    user: {
      id: "user-1",
      name: "Test User",
      email: "test@test.com",
      emailVerified: false,
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
  vi.mocked(useJoinInvite).mockReturnValue({ mutate: mockJoin } as any);
});

describe("InvitePage", () => {
  test("shows loading state", () => {
    vi.mocked(useInvite).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    } as any);
    vi.mocked(useSession).mockReturnValue({ data: null } as any);

    renderWithClient(<InvitePage token="test-token" />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("shows error when invite not found or expired", () => {
    vi.mocked(useInvite).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
    } as any);
    vi.mocked(useSession).mockReturnValue({ data: null } as any);

    renderWithClient(<InvitePage token="test-token" />);

    expect(
      screen.getByText("Invite not found or has expired."),
    ).toBeInTheDocument();
  });

  test("shows login message when not authenticated", () => {
    vi.mocked(useInvite).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockInvite,
    } as any);
    vi.mocked(useSession).mockReturnValue({ data: null } as any);

    renderWithClient(<InvitePage token="test-token" />);

    expect(
      screen.getByText("To join Test Wishlist you need to log in"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log in" })).toBeInTheDocument();
  });

  test("shows wishlist info and join button when authenticated", () => {
    vi.mocked(useInvite).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockInvite,
    } as any);
    vi.mocked(useSession).mockReturnValue(mockSession as any);

    renderWithClient(<InvitePage token="test-token" />);

    expect(screen.getByText("Test Wishlist")).toBeInTheDocument();
    expect(screen.getByText("A test wishlist")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Join" })).toBeInTheDocument();
  });

  test("does not show description when null", () => {
    const inviteWithoutDescription = {
      ...mockInvite,
      wishlist: { ...mockInvite.wishlist, description: null },
    };
    vi.mocked(useInvite).mockReturnValue({
      isLoading: false,
      isError: false,
      data: inviteWithoutDescription,
    } as any);
    vi.mocked(useSession).mockReturnValue(mockSession as any);

    renderWithClient(<InvitePage token="test-token" />);

    expect(screen.queryByText("A test wishlist")).not.toBeInTheDocument();
  });

  test("calls joinInvite when join button clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(useInvite).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockInvite,
    } as any);
    vi.mocked(useSession).mockReturnValue(mockSession as any);

    renderWithClient(<InvitePage token="test-token" />);

    await user.click(screen.getByRole("button", { name: "Join" }));

    expect(mockJoin).toHaveBeenCalledWith(
      "test-token",
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });
});
