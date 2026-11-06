require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

let jobsCache = null;

const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours

// Enable CORS for your React frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get("/jobs", async (req, res) => {
  try {
    // Check whether valid cached data exists
    if (jobsCache && Date.now() < jobsCache.expiresAt) {
      console.log("Serving jobs from cache");

      return res.json({
        message: "Jobs fetched from cache",
        jobs: jobsCache.data,
      });
    }

    // No valid cache: fetch fresh data from JSearch
    console.log("Fetching jobs from JSearch...");

    const url = new URL("https://api.openwebninja.com/jsearch/search-v2");

    url.searchParams.append("query", "developer jobs in Bangladesh");
    url.searchParams.append("country", "bd");
    url.searchParams.append("num_pages", "1");
    url.searchParams.append("date_posted", "month");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": process.env.JSEARCH_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`JSearch API error: ${response.status}`);
    }

    const data = await response.json();

    // Store the response in cache
    jobsCache = {
      data: data.data,
      expiresAt: Date.now() + CACHE_DURATION,
    };

    console.log("Jobs cache updated");

    res.json({
      message: "Jobs fetched successfully!",
      jobs: jobsCache.data,
    });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);

    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
