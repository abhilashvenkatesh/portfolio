import { render, screen } from "@testing-library/react";
import PageHeader from "@/components/ui/PageHeader";

describe("PageHeader", () => {
  it("renders the label text", () => {
    render(<PageHeader label="About me" subtitle="11+ years" />);
    expect(screen.getByText("About me")).toBeInTheDocument();
  });

  it("renders the subtitle as h1", () => {
    render(<PageHeader label="About me" subtitle="11+ years" />);
    expect(screen.getByRole("heading", { level: 1, name: "11+ years" })).toBeInTheDocument();
  });

  it("renders optional intro paragraph when provided", () => {
    render(
      <PageHeader label="About me" subtitle="11+ years" intro="I build things." />
    );
    expect(screen.getByText("I build things.")).toBeInTheDocument();
  });

  it("does not render intro paragraph when omitted", () => {
    render(<PageHeader label="About me" subtitle="11+ years" />);
    expect(screen.queryByText("I build things.")).not.toBeInTheDocument();
  });
});
