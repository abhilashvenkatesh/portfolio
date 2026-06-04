import { render, screen, fireEvent } from "@testing-library/react";
import { useContext } from "react";
import { ThemeProvider, ThemeContext } from "@/components/providers/ThemeProvider";

function ThemeConsumer() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button data-testid="toggle" data-theme-value={theme} onClick={toggleTheme}>
      toggle
    </button>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to light theme when no localStorage value", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("toggle")).toHaveAttribute("data-theme-value", "light");
  });

  it("toggles data-theme on documentElement from light to dark", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId("toggle"));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("toggles data-theme back to light on second click", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId("toggle"));
    fireEvent.click(screen.getByTestId("toggle"));
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("persists theme to localStorage on toggle", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId("toggle"));
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("reads initial theme from localStorage", () => {
    localStorage.setItem("theme", "dark");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("toggle")).toHaveAttribute("data-theme-value", "dark");
  });
});
