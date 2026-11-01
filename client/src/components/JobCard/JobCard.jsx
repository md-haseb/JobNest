import "./JobCard.css";

function JobCard() {
  return (
    <article className="job-card">
      {/* Left: Job information */}
      <div className="job-info">
        <div className="company-logo">
          <img src="https://placehold.co/60x60" alt="Company logo" />
        </div>

        <div className="job-details">
          <h3 className="job-title">Frontend Developer</h3>

          <p className="company-name">Tech Solutions Ltd.</p>

          <div className="job-meta">
            <span>Dhaka, Bangladesh</span>
            <span>Full-time</span>
            <span>Entry Level</span>
          </div>
        </div>
      </div>

      {/* Middle: Salary and posting date */}
      <div className="job-extra">
        <p className="job-salary">৳25,000 – 35,000 / month</p>
        <p className="job-posted">Posted 2 days ago</p>
      </div>

      {/* Right: Save button */}
      <button className="save-button" aria-label="Save job">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" />
        </svg>
      </button>
    </article>
  );
}

// function JobCard({ job }) {
//   return (
//     <article className="job-card">
//       <div className="job-info">
//         <div className="company-logo">
//           <img
//             src={job.employer_logo || "/default-company.png"}
//             alt={`${job.employer_name} logo`}
//           />
//         </div>

//         <div className="job-details">
//           <h3 className="job-title">{job.job_title}</h3>

//           <p className="company-name">{job.employer_name}</p>

//           <div className="job-meta">
//             <span>{job.job_city || "Location not specified"}</span>
//             <span>{job.job_employment_type}</span>
//             <span>{job.job_experience_level || "Not specified"}</span>
//           </div>
//         </div>
//       </div>

//       <div className="job-extra">
//         <p className="job-salary">
//           {job.job_min_salary && job.job_max_salary
//             ? `${job.job_min_salary} - ${job.job_max_salary}`
//             : "Negotiable"}
//         </p>

//         <p className="job-posted">{job.job_posted_at_datetime_utc}</p>
//       </div>

//       <button className="save-button" aria-label="Save job">
//         {/* Bookmark icon */}
//       </button>
//     </article>
//   );
// }

export default JobCard;
