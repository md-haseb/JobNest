import "./JobCard.css";
import { Bookmark, Building2 } from "lucide-react";

function JobCard({ job }) {
  return (
    <article className="job-card">
      <div className="job-info">
        <div className="company-logo">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt={`${job.company} logo`} />
          ) : (
            <Building2 className="default-company-icon" size={25} />
          )}
        </div>

        <div className="job-details">
          <h3 className="job-title">{job.title}</h3>

          <p className="company-name">{job.company}</p>

          <div className="job-meta">
            <span>
              {job.location.city
                ? `${job.location.city}, Bangladesh`
                : "Bangladesh"}
            </span>
            <span>{job.employmentType || "Full Time"}</span>
            <span>{job.experienceLevel || ""}</span>
          </div>
        </div>
      </div>

      <div className="job-extra">
        <p className="job-salary">
          {job.salary.salary
            ? job.salary.salary
            : job.salary.min != null && job.salary.max != null
              ? `${job.salary.min} - ${job.salary.max}`
              : "Negotiable"}
        </p>

        <p className="job-posted">{job.postedAt}</p>
      </div>

      <button className="save-button" aria-label="Save job">
        <Bookmark size={21} />
      </button>
    </article>
  );
}

export default JobCard;
