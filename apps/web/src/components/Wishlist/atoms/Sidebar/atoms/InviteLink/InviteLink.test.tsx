import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { InviteLink } from "./InviteLink";

describe("InviteLink", () => {
  test("renders generate button when no url", () => {
    render(<InviteLink onGenerate={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Generate invite link" }),
    ).toBeInTheDocument();
  });

  test("renders regenerate button when url exists", () => {
    render(
      <InviteLink
        url="https://example.com/invites/token"
        onGenerate={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Generate new invite link" }),
    ).toBeInTheDocument();
  });

  test("does not show url and copy button when no url", () => {
    render(<InviteLink onGenerate={vi.fn()} />);
    expect(
      screen.queryByRole("button", { name: "Copy" }),
    ).not.toBeInTheDocument();
  });

  test("shows url and copy button when url exists", () => {
    render(
      <InviteLink
        url="https://example.com/invites/token"
        onGenerate={vi.fn()}
      />,
    );
    expect(
      screen.getByText("https://example.com/invites/token"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  test("calls onGenerate when generate button clicked", async () => {
    const user = userEvent.setup();
    const onGenerate = vi.fn();
    render(<InviteLink onGenerate={onGenerate} />);

    await user.click(
      screen.getByRole("button", { name: "Generate invite link" }),
    );

    expect(onGenerate).toHaveBeenCalledOnce();
  });

  test("copies url to clipboard when copy button clicked", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(
      <InviteLink
        url="https://example.com/invites/token"
        onGenerate={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith("https://example.com/invites/token");
  });
});
