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

    // employmentType: job.job_employment_type || "",
    employmentType:
      job.job_employment_types?.[0] ||
      extractEmploymentType(job.job_description) ||
      null,

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

const extractEmploymentType = (description) => {
  if (!description) return null;

  const text = description.toLowerCase();

  // 1. Check explicitly labeled fields
  const typeMatch = text.match(
    /(?:job type|employment type|job nature)\s*:\s*([^\n]+)/i,
  );

  if (typeMatch) {
    const type = typeMatch[1].trim();

    if (/full[- ]?time/.test(type)) return "FULLTIME";
    if (/part[- ]?time/.test(type)) return "PARTTIME";
    if (/internship|intern\b/.test(type)) return "INTERN";
    if (/contract/.test(type)) return "CONTRACT";
  }

  // 2. Check explicit employment statements
  const patterns = [
    {
      type: "FULLTIME",
      regex: /\bfull[- ]time\s+(?:paid\s+)?(?:position|role|job|opportunity)\b/,
    },
    {
      type: "PARTTIME",
      regex: /\bpart[- ]time\s+(?:paid\s+)?(?:position|role|job|opportunity)\b/,
    },
    {
      type: "INTERN",
      regex:
        /\b(?:paid\s+)?internship\s+(?:position|role|opportunity|program|programme)\b/,
    },
    {
      type: "CONTRACT",
      regex: /\b(?:fixed[- ]term|contract[- ]based)\s+(?:position|role|job)\b/,
    },
  ];

  const matches = patterns
    .filter((pattern) => pattern.regex.test(text))
    .map((pattern) => pattern.type);

  // Don't guess if multiple types are detected
  const uniqueMatches = [...new Set(matches)];

  return uniqueMatches.length === 1 ? uniqueMatches[0] : null;
};
