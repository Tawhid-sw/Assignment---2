export interface signupProps {
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
}

export interface loginProps {
  email: string;
  password: string;
}
