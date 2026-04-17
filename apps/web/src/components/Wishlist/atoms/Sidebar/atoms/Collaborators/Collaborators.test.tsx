import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Collaborators } from "./Collaborators";
import { useRemoveCollaborator } from "../../../../../../hooks/collaborators/useRemoveCollaborator";
import { useUpdateCollaborator } from "../../../../../../hooks/collaborators/useUpdateCollaborator";

vi.mock("../../../../../../hooks/collaborators/useRemoveCollaborator");
vi.mock("../../../../../../hooks/collaborators/useUpdateCollaborator");

const mockRemove = vi.fn();
const mockUpdate = vi.fn();

const mockCollaborators = [
  {
    id: "collab-1",
    userId: "user-2",
    wishlistId: "wishlist-1",
    role: "viewer" as const,
    user: { id: "user-2", name: "Jane Doe", email: "jane@example.com" },
  },
  {
    id: "collab-2",
    userId: "user-3",
    wishlistId: "wishlist-1",
    role: "editor" as const,
    user: { id: "user-3", name: "John Smith", email: "john@example.com" },
  },
];

beforeEach(() => {
  vi.mocked(useRemoveCollaborator).mockReturnValue({
    mutate: mockRemove,
  } as any);
  vi.mocked(useUpdateCollaborator).mockReturnValue({
    mutate: mockUpdate,
  } as any);
});

describe("Collaborators", () => {
  test("renders empty state when no collaborators", () => {
    render(
      <Collaborators
        isOwner={true}
        collaborators={[]}
        wishlistId="wishlist-1"
      />,
    );
    expect(screen.getByText("No collaborators added")).toBeInTheDocument();
  });

  test("renders collaborator list", () => {
    render(
      <Collaborators
        isOwner={false}
        collaborators={mockCollaborators}
        wishlistId="wishlist-1"
      />,
    );
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  test("shows remove buttons for owner", () => {
    render(
      <Collaborators
        isOwner={true}
        collaborators={mockCollaborators}
        wishlistId="wishlist-1"
      />,
    );
    const removeButtons = screen.getAllByRole("button", { name: "Remove" });
    expect(removeButtons).toHaveLength(2);
  });

  test("hides remove buttons for non-owner", () => {
    render(
      <Collaborators
        isOwner={false}
        collaborators={mockCollaborators}
        wishlistId="wishlist-1"
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Remove" }),
    ).not.toBeInTheDocument();
  });

  test("calls removeCollaborator when remove button clicked", async () => {
    const user = userEvent.setup();
    render(
      <Collaborators
        isOwner={true}
        collaborators={mockCollaborators}
        wishlistId="wishlist-1"
      />,
    );
    const removeButtons = screen.getAllByRole("button", { name: "Remove" });
    await user.click(removeButtons[0]);

    expect(mockRemove).toHaveBeenCalledWith({
      wishlistId: "wishlist-1",
      id: "user-2",
    });
  });

  test("shows role select for owner", () => {
    render(
      <Collaborators
        isOwner={true}
        collaborators={mockCollaborators}
        wishlistId="wishlist-1"
      />,
    );
    const selects = screen.getAllByRole("combobox", {
      name: "Role of collaborator",
    });
    expect(selects).toHaveLength(2);
  });

  test("shows role as text for non-owner", () => {
    render(
      <Collaborators
        isOwner={false}
        collaborators={mockCollaborators}
        wishlistId="wishlist-1"
      />,
    );
    expect(
      screen.queryByRole("combobox", { name: "Role of collaborator" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("viewer")).toBeInTheDocument();
    expect(screen.getByText("editor")).toBeInTheDocument();
  });

  test("calls updateCollaborator when role changed", async () => {
    const user = userEvent.setup();
    render(
      <Collaborators
        isOwner={true}
        collaborators={mockCollaborators}
        wishlistId="wishlist-1"
      />,
    );
    const selects = screen.getAllByRole("combobox", {
      name: "Role of collaborator",
    });
    await user.selectOptions(selects[0], "editor");

    expect(mockUpdate).toHaveBeenCalledWith({
      wishlistId: "wishlist-1",
      id: "user-2",
      role: "editor",
    });
  });
});
