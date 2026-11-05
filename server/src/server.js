const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS for your React frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get("/", (req, res) => {
  res.json({
    message: "Jobs fetched successfully!",
    jobs: [
      {
        id: 1,
        title: "Frontend Developer",
        company: "ABC Technologies",
        location: "Dhaka, Bangladesh",
      },
      {
        id: 2,
        title: "React Developer",
        company: "XYZ Solutions",
        location: "Remote",
      },
    ],
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
