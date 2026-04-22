import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { Select } from "./Select";

describe("Select", () => {
  test("renders label and select", () => {
    render(
      <Select id="test" label="Visibility">
        <option value="public">Public</option>
      </Select>,
    );
    expect(screen.getByLabelText("Visibility")).toBeInTheDocument();
  });

  test("renders without label when not provided", () => {
    render(
      <Select id="test">
        <option value="public">Public</option>
      </Select>,
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("renders options", () => {
    render(
      <Select id="test" label="Visibility">
        <option value="public">Public</option>
        <option value="private">Private</option>
      </Select>,
    );
    expect(screen.getByRole("option", { name: "Public" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Private" })).toBeInTheDocument();
  });

  test("shows error message when error provided", () => {
    render(
      <Select id="test" label="Visibility" error="Required">
        <option value="public">Public</option>
      </Select>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  test("calls onChange when option selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select id="test" label="Visibility" onChange={onChange}>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </Select>,
    );

    await user.selectOptions(screen.getByRole("combobox"), "private");
    expect(onChange).toHaveBeenCalled();
  });

  test("is disabled when disabled prop passed", () => {
    render(
      <Select id="test" label="Visibility" disabled>
        <option value="public">Public</option>
      </Select>,
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
