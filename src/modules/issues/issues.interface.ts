export interface issueBodyProps {
  title: string;
  description: string;
  type: string;
}

export interface issueUpdateProps {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
}

export interface issueFilterProps {
  sort?: string;
  type?: string;
  status?: string;
}

export interface issueReporterProps {
  id: number;
  name: string;
  role: string;
}
