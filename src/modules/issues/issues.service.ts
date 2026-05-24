import { pool } from "../../db";
import type {
  issueBodyProps,
  issueUpdateProps,
  issueFilterProps,
} from "./issues.interface";

const validateIssueFields = (
  title: string,
  description: string,
  type: string,
) => {
  if (title.length > 150) throw new Error("Title must be in 150 characters.");
  if (description.length < 20)
    throw new Error("Description must be at least 20 characters.");
  if (type !== "bug" && type !== "feature_request")
    throw new Error("Type must be bug or feature_request.");
};

// reusable for reporter info by id
const getReporterById = async (reporterId: number) => {
  const result = await pool.query(
    "SELECT id, name, role FROM users WHERE id = $1",
    [reporterId],
  );
  return result.rows[0] || null;
};

export const createIssueService = async (
  payload: issueBodyProps,
  reporterId: number,
) => {
  const { title, description, type } = payload;

  if (!title || !description || !type)
    throw new Error("All fields are required");

  validateIssueFields(title, description, type);

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};

export const getAllIssuesService = async (payload: issueFilterProps) => {
  const { sort, type, status } = payload;

  if (type && type !== "bug" && type !== "feature_request")
    throw new Error("Type must be bug or feature_request.");
  if (
    status &&
    status !== "open" &&
    status !== "in_progress" &&
    status !== "resolved"
  )
    throw new Error("Status must be open, in_progress, or resolved.");

  const order = sort === "oldest" ? "ASC" : "DESC";

  // status and type combination
  let result;

  if (type && status) {
    result = await pool.query(
      `SELECT * FROM issues WHERE type = $1 AND status = $2 ORDER BY created_at ${order}`,
      [type, status],
    );
  } else if (type) {
    result = await pool.query(
      `SELECT * FROM issues WHERE type = $1 ORDER BY created_at ${order}`,
      [type],
    );
  } else if (status) {
    result = await pool.query(
      `SELECT * FROM issues WHERE status = $1 ORDER BY created_at ${order}`,
      [status],
    );
  } else {
    result = await pool.query(
      `SELECT * FROM issues ORDER BY created_at ${order}`,
    );
  }

  const issues = result.rows;

  if (issues.length === 0) return [];

  // get reporter for each issue one by one
  const issuesWithReporter = [];
  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    const reporter = await getReporterById(issue.reporter_id);
    const { reporter_id, ...issueData } = issue;
    issuesWithReporter.push({ ...issueData, reporter });
  }

  return issuesWithReporter;
};

export const getSingleIssueService = async (id: string) => {
  const result = await pool.query("SELECT * FROM issues WHERE id = $1", [id]);

  if (result.rows.length === 0) throw new Error("Issue not found.");

  const issue = result.rows[0];
  const reporter = await getReporterById(issue.reporter_id);

  const { reporter_id, ...issueData } = issue;
  return { ...issueData, reporter };
};

export const updateIssueService = async (
  id: string,
  body: issueUpdateProps,
  currentUser: { id: number; role: string },
) => {
  const { title, description, type, status } = body;

  const issueResult = await pool.query("SELECT * FROM issues WHERE id = $1", [
    id,
  ]);
  if (issueResult.rows.length === 0) throw new Error("Issue not found.");

  const issue = issueResult.rows[0];

  if (currentUser.role === "contributor") {
    if (issue.reporter_id !== currentUser.id)
      throw new Error("You can only update your own issues.");
    if (issue.status !== "open")
      throw new Error(
        "CONFLICT: You can only update your issue when it is still open.",
      );
    if (status !== undefined)
      throw new Error(
        "FORBIDDEN: Contributors cannot change the issue status.",
      );
    if (!title || !description || !type)
      throw new Error("Please provide title, description and type.");

    validateIssueFields(title, description, type);

    const updatedResult = await pool.query(
      `UPDATE issues SET title = $1, description = $2, type = $3, updated_at = NOW() WHERE id = $4 RETURNING *`,
      [title, description, type, id],
    );
    return updatedResult.rows[0];
  }

  // maintainer can also update status
  if (!title || !description || !type || !status)
    throw new Error("Please provide title, description, type and status.");

  validateIssueFields(title, description, type);

  if (status !== "open" && status !== "in_progress" && status !== "resolved")
    throw new Error("Status must be open, in_progress, or resolved.");

  const updatedResult = await pool.query(
    `UPDATE issues SET title = $1, description = $2, type = $3, status = $4, updated_at = NOW() WHERE id = $5 RETURNING *`,
    [title, description, type, status, id],
  );
  return updatedResult.rows[0];
};

export const deleteIssueService = async (id: string) => {
  const issueResult = await pool.query("SELECT id FROM issues WHERE id = $1", [
    id,
  ]);
  if (issueResult.rows.length === 0) throw new Error("Issue not found.");

  await pool.query("DELETE FROM issues WHERE id = $1", [id]);
};
