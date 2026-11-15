const normalizeJob = (job) => {
  return {
    id: job.job_id,
    title: job.job_title || "",
    company: job.employer_name || "",
    companyLogo: job.employer_logo || "",

    location: {
      city: job.job_city || "",
      country: job.job_country || "",
      isRemote: job.job_is_remote ?? false,
    },

    employmentType: job.job_employment_type || "",

    experienceLevel: "",

    salary: {
      salary: job.job_salary ?? null,
      min: job.job_min_salary ?? null,
      max: job.job_max_salary ?? null,
    },

    description: job.job_description || "",
    applyLink: job.job_apply_link || "",
    postedAt: job.job_posted_at || "",
    postedAtUTC: job.job_posted_at_datetime_utc ?? null,
  };
};

module.exports = normalizeJob;
