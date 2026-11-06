import "./JobCard.css";
import { Bookmark, Building2 } from "lucide-react";

function JobCard({ job }) {
  return (
    <article className="job-card">
      <div className="job-info">
        <div className="company-logo">
          {job.employer_logo ? (
            <img src={job.employer_logo} alt={`${job.employer_name} logo`} />
          ) : (
            <Building2 className="default-company-icon" size={25} />
          )}
        </div>

        <div className="job-details">
          <h3 className="job-title">{job.job_title}</h3>

          <p className="company-name">{job.employer_name}</p>

          <div className="job-meta">
            <span>
              {job.job_city ? `${job.job_city}, Bangladesh` : "Bangladesh"}
            </span>
            <span>{job.job_employment_type || "Full Time"}</span>
            <span>{job.job_experience_level || ""}</span>
          </div>
        </div>
      </div>

      <div className="job-extra">
        <p className="job-salary">
          {job.job_salary
            ? job.job_salary
            : job.job_min_salary && job.job_max_salary
              ? `${job.job_min_salary} - ${job.job_max_salary}`
              : "Negotiable"}
        </p>

        <p className="job-posted">{job.job_posted_at}</p>
      </div>

      <button className="save-button" aria-label="Save job">
        <Bookmark size={21} />
      </button>
    </article>
  );
}

export default JobCard;
