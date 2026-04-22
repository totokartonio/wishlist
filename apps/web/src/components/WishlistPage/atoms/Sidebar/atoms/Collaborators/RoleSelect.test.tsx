import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { RoleSelect } from "./RoleSelect";

describe("RoleSelect", () => {
  test("renders with default value", () => {
    render(<RoleSelect defaultValue="viewer" onUpdate={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("viewer");
  });

  test("renders both options", () => {
    render(<RoleSelect defaultValue="viewer" onUpdate={vi.fn()} />);
    expect(screen.getByRole("option", { name: "Viewer" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Editor" })).toBeInTheDocument();
  });

  test("calls onUpdate with new value when changed", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<RoleSelect defaultValue="viewer" onUpdate={onUpdate} />);

    await user.selectOptions(screen.getByRole("combobox"), "editor");

    expect(onUpdate).toHaveBeenCalledWith("editor");
  });

  test("updates displayed value after change", async () => {
    const user = userEvent.setup();
    render(<RoleSelect defaultValue="viewer" onUpdate={vi.fn()} />);

    await user.selectOptions(screen.getByRole("combobox"), "editor");

    expect(screen.getByRole("combobox")).toHaveValue("editor");
  });

  test("renders with editor as default value", () => {
    render(<RoleSelect defaultValue="editor" onUpdate={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("editor");
  });
});
