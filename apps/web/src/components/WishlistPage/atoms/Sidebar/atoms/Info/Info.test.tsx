import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Info } from "./Info";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

const baseProps = {
  name: "Test Wishlist",
  visibility: "private" as const,
  created: "2024-01-01",
  isOwner: false,
  canEdit: false,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("Info", () => {
  test("renders wishlist name, visibility and created date", () => {
    render(<Info {...baseProps} />);
    expect(screen.getByText("Test Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Private")).toBeInTheDocument();
    expect(screen.getByText("01.01.2024")).toBeInTheDocument();
  });

  test("renders edit and delete buttons when canEdit and isOwner", () => {
    render(<Info {...baseProps} canEdit={true} isOwner={true} />);
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  test("renders only edit button when canEdit but not isOwner", () => {
    render(<Info {...baseProps} canEdit={true} isOwner={false} />);
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });

  test("renders owner name as link when owner provided", () => {
    render(<Info {...baseProps} owner={{ id: "user-1", name: "Jane Doe" }} />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  test("does not render owner section when owner is undefined", () => {
    render(<Info {...baseProps} />);
    expect(screen.queryByText(/Created by/)).not.toBeInTheDocument();
  });
});
