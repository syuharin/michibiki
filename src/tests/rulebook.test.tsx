import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RulebookModal from "@/components/rulebook/RulebookModal";
import * as rulesLib from "@/lib/game/rules";

// Mock the fetch utility
vi.mock("@/lib/game/rules", () => ({
  fetchRulebook: vi.fn(),
}));

describe("RulebookModal", () => {
  it("should not render when isOpen is false", () => {
    render(<RulebookModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText(/Rulebook/i)).not.toBeInTheDocument();
  });

  it("should render and fetch content when isOpen is true", async () => {
    const mockContent = "# Test Rules";
    vi.mocked(rulesLib.fetchRulebook).mockResolvedValue(mockContent);

    render(<RulebookModal isOpen={true} onClose={() => {}} />);
    
    expect(screen.getByText(/Rulebook/i)).toBeInTheDocument();
    expect(await screen.findByText(/Test Rules/i)).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<RulebookModal isOpen={true} onClose={onClose} />);
    
    const closeButtons = screen.getAllByRole("button");
    const closeBtn = closeButtons.find(btn => btn.textContent?.includes("閉じる") || btn.getAttribute("aria-label") === "Close");
    
    if (closeBtn) {
      fireEvent.click(closeBtn);
    }
    
    expect(onClose).toHaveBeenCalled();
  });
});
