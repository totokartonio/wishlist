import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { Actions } from "./Actions";
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

describe("Actions", () => {
  test("renders edit, delete and archive buttons", () => {
    render(
      <Actions
        item={baseItem}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onArchive={vi.fn()}
        onUnarchive={vi.fn()}
      />,
    );

    expect(screen.getByTestId("items-table-edit-button")).toBeInTheDocument();
    expect(screen.getByTestId("items-table-delete-button")).toBeInTheDocument();
    expect(
      screen.getByTestId("items-table-archive-button"),
    ).toBeInTheDocument();
  });

  test("archive button shows Archive label when item is not archived", () => {
    render(
      <Actions
        item={baseItem}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onArchive={vi.fn()}
        onUnarchive={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Archive")).toBeInTheDocument();
  });

  test("archive button shows Unarchive label when item is archived", () => {
    render(
      <Actions
        item={{ ...baseItem, archived: true }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onArchive={vi.fn()}
        onUnarchive={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Unarchive")).toBeInTheDocument();
  });

  test("calls onEdit when edit button clicked", async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();

    render(
      <Actions
        item={baseItem}
        onEdit={mockOnEdit}
        onDelete={vi.fn()}
        onArchive={vi.fn()}
        onUnarchive={vi.fn()}
      />,
    );

    await user.click(screen.getByTestId("items-table-edit-button"));
    expect(mockOnEdit).toHaveBeenCalledWith("1");
  });

  test("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    const mockOnDelete = vi.fn();

    render(
      <Actions
        item={baseItem}
        onEdit={vi.fn()}
        onDelete={mockOnDelete}
        onArchive={vi.fn()}
        onUnarchive={vi.fn()}
      />,
    );

    await user.click(screen.getByTestId("items-table-delete-button"));
    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  test("calls onArchive when archive button clicked on non-archived item", async () => {
    const user = userEvent.setup();
    const mockOnArchive = vi.fn();

    render(
      <Actions
        item={baseItem}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onArchive={mockOnArchive}
        onUnarchive={vi.fn()}
      />,
    );

    await user.click(screen.getByTestId("items-table-archive-button"));
    expect(mockOnArchive).toHaveBeenCalledWith("1");
  });

  test("calls onUnarchive when archive button clicked on archived item", async () => {
    const user = userEvent.setup();
    const mockOnUnarchive = vi.fn();

    render(
      <Actions
        item={{ ...baseItem, archived: true }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onArchive={vi.fn()}
        onUnarchive={mockOnUnarchive}
      />,
    );

    await user.click(screen.getByTestId("items-table-archive-button"));
    expect(mockOnUnarchive).toHaveBeenCalledWith("1");
  });
});
