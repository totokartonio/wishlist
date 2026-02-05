import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { ItemsTable } from "./ItemsTable";
import type { Item } from "../../../../types";

describe("ItemsTable", () => {
  const mockItems: Item[] = [
    {
      id: "1",
      name: "Sony headphones",
      price: 100,
      currency: "EUR",
      link: "https://amazon.de",
      image: "Image",
      status: "want" as const,
    },
    {
      id: "2",
      name: "USB Cable",
      price: 10,
      currency: "USD",
      link: "https://ebay.de",
      image: "Image",
      status: "bought" as const,
    },
  ];

  test("show items in table", () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnChangeStatus = vi.fn();

    render(
      <ItemsTable
        items={mockItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onChangeStatus={mockOnChangeStatus}
      />,
    );

    //Text
    expect(screen.getByText("Sony headphones")).toBeInTheDocument();
    expect(screen.getByText("€100")).toBeInTheDocument();
    expect(screen.getByText("USB Cable")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();

    //Status
    const statusSelects = screen.getAllByTestId("items-table-status");
    expect(statusSelects[0]).toHaveValue("want");
    expect(statusSelects[1]).toHaveValue("bought");

    //Links
    const links = screen.getAllByTestId("items-table-link");
    expect(links[0]).toHaveAttribute("href", "https://amazon.de");
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[1]).toHaveAttribute("href", "https://ebay.de");
    expect(links[1]).toHaveAttribute("target", "_blank");
  });

  test("renders table headers", () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnChangeStatus = vi.fn();

    render(
      <ItemsTable
        items={mockItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onChangeStatus={mockOnChangeStatus}
      />,
    );

    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Link")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("calls onEdit when edit button clicked", async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnChangeStatus = vi.fn();

    render(
      <ItemsTable
        items={mockItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onChangeStatus={mockOnChangeStatus}
      />,
    );

    const editButtons = screen.getAllByTestId("items-table-edit-button");
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith("1");
  });

  test("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnChangeStatus = vi.fn();

    render(
      <ItemsTable
        items={mockItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onChangeStatus={mockOnChangeStatus}
      />,
    );

    const editButtons = screen.getAllByTestId("items-table-delete-button");
    await user.click(editButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  test("renders correct number of rows", () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnChangeStatus = vi.fn();

    render(
      <ItemsTable
        items={mockItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onChangeStatus={mockOnChangeStatus}
      />,
    );

    const rows = screen.getAllByTestId("items-table-body-row");
    expect(rows).toHaveLength(2);
  });

  test("renders empty table when no items", () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnChangeStatus = vi.fn();

    render(
      <ItemsTable
        items={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onChangeStatus={mockOnChangeStatus}
      />,
    );

    expect(screen.getByText("Item Name")).toBeInTheDocument();
    const rows = screen.getAllByTestId("items-table-header-row");
    expect(rows).toHaveLength(1);

    const bodyRows = screen.queryAllByTestId("items-table-body-row");
    expect(bodyRows).toHaveLength(0);
  });

  test("changes status of item", async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnChangeStatus = vi.fn();

    render(
      <ItemsTable
        items={mockItems}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onChangeStatus={mockOnChangeStatus}
      />,
    );

    const statusSelects = screen.getAllByTestId("items-table-status");
    expect(statusSelects[0]).toHaveValue("want");
    expect(statusSelects[1]).toHaveValue("bought");

    await user.selectOptions(statusSelects[0], "bought");

    expect(mockOnChangeStatus).toHaveBeenCalledTimes(1);
    expect(mockOnChangeStatus).toHaveBeenCalledWith("1", "bought");
  });
});
