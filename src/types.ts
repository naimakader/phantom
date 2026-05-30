export interface Issue {
  id: string;
  description: string;
  help: string;
  helpUrl?: string;
  impact: "minor" | "moderate" | "serious" | "critical" | "none";
  nodes: number;
  selector?: string; // CSS selector of the first broken element on the page
}

export interface ScanResult {
  violations: Issue[];
  passes: Issue[];
  incomplete: any[];
}
