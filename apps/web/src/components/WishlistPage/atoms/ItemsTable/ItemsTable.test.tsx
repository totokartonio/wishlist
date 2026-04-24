import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { ItemsTable } from "./ItemsTable";
import type { Item } from "@wishlist/types";

const mockItems: Item[] = [
  {
    id: "1",
    name: "Sony headphones",
    price: 100,
    currency: "EUR",
    link: "https://amazon.de",
    image: "Image",
    status: "want",
    archived: false,
    claimedByUserId: null,
  },
  {
    id: "2",
    name: "USB Cable",
    price: 10,
    currency: "USD",
    link: "https://ebay.de",
    image: "Image",
    status: "claimed",
    archived: false,
    claimedByUserId: "user-2",
  },
];

const defaultProps = {
  items: mockItems,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onClaim: vi.fn(),
  onUnclaim: vi.fn(),
  onArchive: vi.fn(),
  onUnarchive: vi.fn(),
  userId: "user-1",
  canEdit: true,
  showClaim: true,
};

describe("ItemsTable", () => {
  test("renders item names and prices", () => {
    render(<ItemsTable {...defaultProps} />);

    expect(screen.getByText("Sony headphones")).toBeInTheDocument();
    expect(screen.getByText("€100")).toBeInTheDocument();
    expect(screen.getByText("USB Cable")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
  });

  test("renders links correctly", () => {
    render(<ItemsTable {...defaultProps} />);

    const links = screen.getAllByTestId("items-table-link");
    expect(links[0]).toHaveAttribute("href", "https://amazon.de");
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[1]).toHaveAttribute("href", "https://ebay.de");
  });

  test("renders correct number of rows", () => {
    render(<ItemsTable {...defaultProps} />);

    const rows = screen.getAllByTestId("items-table-body-row");
    expect(rows).toHaveLength(2);
  });

  test("renders empty table when no items", () => {
    render(<ItemsTable {...defaultProps} items={[]} />);

    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.queryAllByTestId("items-table-body-row")).toHaveLength(0);
  });

  test("renders table headers with actions and status when canEdit and showClaim", () => {
    render(<ItemsTable {...defaultProps} />);

    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Link")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("hides actions column when canEdit is false", () => {
    render(<ItemsTable {...defaultProps} canEdit={false} />);

    expect(screen.queryByText("Actions")).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("items-table-edit-button")).toHaveLength(0);
    expect(screen.queryAllByTestId("items-table-delete-button")).toHaveLength(
      0,
    );
  });

  test("hides status column when showClaim is false", () => {
    render(<ItemsTable {...defaultProps} showClaim={false} />);

    expect(screen.queryByText("Status")).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("items-table-claim-button")).toHaveLength(0);
  });

  test("shows claim button for unclaimed item", () => {
    render(<ItemsTable {...defaultProps} />);

    const claimButtons = screen.getAllByTestId("items-table-claim-button");
    expect(claimButtons[0]).toHaveTextContent("Claim");
    expect(claimButtons[0]).not.toBeDisabled();
  });

  test("shows disabled Claimed button when item claimed by someone else", () => {
    render(<ItemsTable {...defaultProps} />);

    const claimButtons = screen.getAllByTestId("items-table-claim-button");
    expect(claimButtons[1]).toHaveTextContent("Claimed");
    expect(claimButtons[1]).toBeDisabled();
  });

  test("shows Unclaim button when item claimed by current user", () => {
    const itemsWithOwnClaim = [
      mockItems[0],
      { ...mockItems[1], claimedByUserId: "user-1" },
    ];

    render(<ItemsTable {...defaultProps} items={itemsWithOwnClaim} />);

    const claimButtons = screen.getAllByTestId("items-table-claim-button");
    expect(claimButtons[1]).toHaveTextContent("Unclaim");
    expect(claimButtons[1]).not.toBeDisabled();
  });

  test("calls onEdit when edit button clicked", async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();

    render(<ItemsTable {...defaultProps} onEdit={mockOnEdit} />);

    const editButtons = screen.getAllByTestId("items-table-edit-button");
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith("1");
  });

  test("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    const mockOnDelete = vi.fn();

    render(<ItemsTable {...defaultProps} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByTestId("items-table-delete-button");
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  test("calls onClaim when Claim button clicked", async () => {
    const user = userEvent.setup();
    const mockOnClaim = vi.fn();

    render(<ItemsTable {...defaultProps} onClaim={mockOnClaim} />);

    const claimButtons = screen.getAllByTestId("items-table-claim-button");
    await user.click(claimButtons[0]);

    expect(mockOnClaim).toHaveBeenCalledWith("1");
  });

  test("calls onArchive when archive button clicked", async () => {
    const user = userEvent.setup();
    const mockOnArchive = vi.fn();

    render(<ItemsTable {...defaultProps} onArchive={mockOnArchive} />);

    const archiveButtons = screen.getAllByTestId("items-table-archive-button");
    await user.click(archiveButtons[0]);

    expect(mockOnArchive).toHaveBeenCalledWith("1");
  });
});
