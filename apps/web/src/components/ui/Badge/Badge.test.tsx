import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  test("renders children", () => {
    render(<Badge variant="primary">Hello</Badge>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  test("applies primary variant", () => {
    render(<Badge variant="primary">Primary</Badge>);
    expect(screen.getByText("Primary")).toHaveAttribute(
      "class",
      expect.stringContaining("primary"),
    );
  });

  test("applies secondary variant", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText("Secondary")).toHaveAttribute(
      "class",
      expect.stringContaining("secondary"),
    );
  });

  test("applies neutral variant", () => {
    render(<Badge variant="neutral">Neutral</Badge>);
    expect(screen.getByText("Neutral")).toHaveAttribute(
      "class",
      expect.stringContaining("neutral"),
    );
  });

  test("applies additional className", () => {
    render(
      <Badge variant="primary" className="extra">
        Badge
      </Badge>,
    );
    expect(screen.getByText("Badge")).toHaveAttribute(
      "class",
      expect.stringContaining("extra"),
    );
  });
});
