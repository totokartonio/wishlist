import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { LinkButton } from "./LinkButton";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    Link: ({
      children,
      className,
      to,
    }: {
      children: React.ReactNode;
      className?: string;
      to: string;
    }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
  };
});

describe("LinkButton", () => {
  test("renders children", () => {
    render(
      <LinkButton variant="raised" color="primary" to="/dashboard">
        Go to dashboard
      </LinkButton>,
    );
    expect(
      screen.getByRole("link", { name: "Go to dashboard" }),
    ).toBeInTheDocument();
  });

  test("renders as anchor tag with correct href", () => {
    render(
      <LinkButton variant="raised" color="primary" to="/dashboard">
        Dashboard
      </LinkButton>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/dashboard");
  });

  test("applies ghost variant", () => {
    render(
      <LinkButton variant="ghost" color="primary" to="/login">
        Log in
      </LinkButton>,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "class",
      expect.stringContaining("ghost"),
    );
  });

  test("applies flat variant", () => {
    render(
      <LinkButton variant="flat" color="primary" to="/login">
        Log in
      </LinkButton>,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "class",
      expect.stringContaining("flat"),
    );
  });

  test("applies secondary color", () => {
    render(
      <LinkButton variant="raised" color="secondary" to="/login">
        Sign up
      </LinkButton>,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "class",
      expect.stringContaining("secondary"),
    );
  });

  test("applies sm size", () => {
    render(
      <LinkButton variant="raised" color="primary" size="sm" to="/login">
        Small
      </LinkButton>,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "class",
      expect.stringContaining("sm"),
    );
  });

  test("applies additional className", () => {
    render(
      <LinkButton
        variant="raised"
        color="primary"
        to="/login"
        className="extra"
      >
        Extra
      </LinkButton>,
    );
    expect(screen.getByRole("link")).toHaveAttribute(
      "class",
      expect.stringContaining("extra"),
    );
  });
});
