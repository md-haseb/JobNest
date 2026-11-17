const normalizeJob = (job) => {
  console.log(job.job_highlights);
  console.log(job.job_highlights?.Qualifications);
  console.log(job);
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

    experienceLevel: extractSeniority(job.job_title, job.job_description) || "",

    salary: {
      salary: job.job_salary ?? null,
      min: job.job_min_salary ?? null,
      max: job.job_max_salary ?? null,
    },

    description: job.job_description || "",
    qualifications: job.job_highlights?.Qualifications || [],
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

function extractSeniority(title = "", description = "") {
  const normalizedTitle = title.toLowerCase();
  const normalizedDescription = description.toLowerCase();

  // 1. Check job title first (strongest signal)
  const seniorityPatterns = [
    {
      level: "internship",
      pattern: /\b(intern|internship|trainee)\b/i,
    },
    {
      level: "entry-level",
      pattern: /\b(entry[- ]level|fresher|fresh graduate|graduate trainee)\b/i,
    },
    {
      level: "junior",
      pattern: /\b(junior|jr\.?)\b/i,
    },
    {
      level: "mid-level",
      pattern: /\b(mid[- ]level|intermediate)\b/i,
    },
    {
      level: "senior",
      pattern: /\b(senior|sr\.?)\b/i,
    },
    {
      level: "lead",
      pattern: /\b(tech lead|team lead|lead developer|lead engineer)\b/i,
    },
    {
      level: "principal",
      pattern: /\b(principal)\b/i,
    },
    {
      level: "director",
      pattern: /\b(director|head of)\b/i,
    },
  ];

  // 2. Search title first
  for (const item of seniorityPatterns) {
    if (item.pattern.test(normalizedTitle)) {
      return item.level;
    }
  }

  // 3. Search description if title has no explicit seniority
  for (const item of seniorityPatterns) {
    if (item.pattern.test(normalizedDescription)) {
      return item.level;
    }
  }

  // 4. No explicit seniority found
  return null;
}
