import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Sidebar } from "./Sidebar";
import type { Collaborator } from "@wishlist/types";

vi.mock("./atoms/Collaborators", () => ({
  default: () => <div data-testid="collaborators" />,
}));

vi.mock("./atoms/InviteLink", () => ({
  default: () => <div data-testid="invite-link" />,
}));

vi.mock("./atoms/Info", () => ({
  default: () => <div data-testid="info" />,
}));

const mockCollaborators: Collaborator[] = [
  {
    id: "collab-1",
    userId: "user-2",
    wishlistId: "wishlist-1",
    role: "viewer",
    user: { id: "user-2", name: "Jane Doe", email: "jane@example.com" },
  },
];

const baseProps = {
  owner: { id: "user-1", name: "Test User" },
  name: "Test Wishlist",
  visibility: "private" as const,
  created: "2024-01-01",
  collaborators: mockCollaborators,
  wishlistId: "wishlist-1",
  onGenerate: vi.fn(),
  onClose: vi.fn(),
};

describe("Sidebar", () => {
  test("always renders info section", () => {
    render(<Sidebar {...baseProps} isOwner={false} />);
    expect(screen.getByTestId("info")).toBeInTheDocument();
  });

  test("renders collaborators section", () => {
    render(<Sidebar {...baseProps} isOwner={true} />);
    expect(screen.getByTestId("collaborators")).toBeInTheDocument();
  });

  test("shows invite link for owner with invite visibility", () => {
    render(<Sidebar {...baseProps} isOwner={true} visibility="invite" />);
    expect(screen.getByTestId("invite-link")).toBeInTheDocument();
  });

  test("hides invite link for non-owner", () => {
    render(<Sidebar {...baseProps} isOwner={false} visibility="invite" />);
    expect(screen.queryByTestId("invite-link")).not.toBeInTheDocument();
  });

  test("hides invite link for owner with private visibility", () => {
    render(<Sidebar {...baseProps} isOwner={true} visibility="private" />);
    expect(screen.queryByTestId("invite-link")).not.toBeInTheDocument();
  });

  test("hides invite link for owner with public visibility", () => {
    render(<Sidebar {...baseProps} isOwner={true} visibility="public" />);
    expect(screen.queryByTestId("invite-link")).not.toBeInTheDocument();
  });
});
