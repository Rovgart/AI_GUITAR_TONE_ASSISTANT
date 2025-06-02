import { render, screen } from "@testing-library/react";

import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

import AdvancedSettings from "@/organisms/AdvancedSettings";
describe("renders advanced settings", () => {
  it("Render a app ", () => {
    render(<AdvancedSettings isVisible={false} visibilityHandler={() => {}} />);
    expect(screen.getByText("Guitar Tone Assistant")).toBeInTheDocument();
  });
});
