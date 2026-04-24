import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { ClaimButton } from "./ClaimButton";
import type { Item } from "@wishlist/types";

const baseItem: Item = {
  id: "1",
  name: "Sony headphones",
  price: 100,
  currency: "EUR",
  link: "https://amazon.de",
  image: "Image",
  status: "want",
  archived: false,
  claimedByUserId: null,
};

describe("ClaimButton", () => {
  test("shows active Claim button when item is not claimed", () => {
    render(
      <ClaimButton
        item={baseItem}
        userId="user-1"
        onClaim={vi.fn()}
        onUnclaim={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", { name: "Claim" });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test("shows active Unclaim button when item is claimed by current user", () => {
    render(
      <ClaimButton
        item={{ ...baseItem, status: "claimed", claimedByUserId: "user-1" }}
        userId="user-1"
        onClaim={vi.fn()}
        onUnclaim={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", { name: "Unclaim" });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test("shows disabled Claimed button when item is claimed by someone else", () => {
    render(
      <ClaimButton
        item={{ ...baseItem, status: "claimed", claimedByUserId: "user-2" }}
        userId="user-1"
        onClaim={vi.fn()}
        onUnclaim={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", { name: "Claimed" });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test("shows disabled Claimed button when userId is null and item is claimed", () => {
    render(
      <ClaimButton
        item={{ ...baseItem, status: "claimed", claimedByUserId: "user-1" }}
        userId={null}
        onClaim={vi.fn()}
        onUnclaim={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", { name: "Claimed" });
    expect(button).toBeDisabled();
  });

  test("calls onClaim when Claim button clicked", async () => {
    const user = userEvent.setup();
    const mockOnClaim = vi.fn();

    render(
      <ClaimButton
        item={baseItem}
        userId="user-1"
        onClaim={mockOnClaim}
        onUnclaim={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Claim" }));
    expect(mockOnClaim).toHaveBeenCalledWith("1");
  });

  test("calls onUnclaim when Unclaim button clicked", async () => {
    const user = userEvent.setup();
    const mockOnUnclaim = vi.fn();

    render(
      <ClaimButton
        item={{ ...baseItem, status: "claimed", claimedByUserId: "user-1" }}
        userId="user-1"
        onClaim={vi.fn()}
        onUnclaim={mockOnUnclaim}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Unclaim" }));
    expect(mockOnUnclaim).toHaveBeenCalledWith("1");
  });
});
