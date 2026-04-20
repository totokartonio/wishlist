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
};

describe("Info", () => {
  test("renders wishlist name, visibility and created date", () => {
    render(<Info {...baseProps} />);
    expect(screen.getByText("Test Wishlist")).toBeInTheDocument();
    expect(screen.getByText("private")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
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
