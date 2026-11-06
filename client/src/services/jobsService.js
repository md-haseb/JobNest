const API_URL = "http://localhost:5000";

export async function fetchJobs() {
  const response = await fetch(`${API_URL}/jobs`);

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const data = await response.json();
  console.log(data.jobs);

  return data.jobs.jobs;
}
