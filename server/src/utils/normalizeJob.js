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
  // for (const item of seniorityPatterns) {
  //   if (item.pattern.test(normalizedDescription)) {
  //     return item.level;
  //   }
  // }
  return extractSeniorityFromDescription(normalizedDescription);

  // 4. No explicit seniority found
  return null;
}

function extractSeniorityFromDescription(description = "") {
  if (!description) return null;

  // 1. Define explicit seniority terms
  const seniorityPatterns = [
    {
      level: "internship",
      pattern: String.raw`intern(?:ship)?|trainee`,
    },
    {
      level: "entry-level",
      pattern: String.raw`entry[- ]level|graduate[- ]level`,
    },
    {
      level: "junior",
      pattern: String.raw`junior(?:[- ]level)?|jr\.?`,
    },
    {
      level: "mid-level",
      pattern: String.raw`mid[- ]level|intermediate[- ]level`,
    },
    {
      level: "senior",
      pattern: String.raw`senior(?:[- ]level)?|sr\.?`,
    },
    {
      level: "lead",
      pattern: String.raw`lead(?:[- ]level)?`,
    },
    {
      level: "principal",
      pattern: String.raw`principal`,
    },
    {
      level: "director",
      pattern: String.raw`director`,
    },
  ];

  // 2. Job-role keywords
  const rolePattern = String.raw`(?:(?:frontend|front-end|backend|back-end|full[- ]stack|software|web|technical|engineering|react|node\.?js|python|java|angular|dotnet|\.net)\s+){0,3}(?:developer|engineer|architect|designer|programmer|manager|specialist|consultant)`;

  // 3. Identify relevant sections
  const lines = description.split(/\r?\n/);

  const relevantSections = [
    "job overview",
    "role overview",
    "job context",
    "about the role",
    "about the position",
    "job highlights",
    "we are looking for",
    "requirements",
    "qualifications",
    "what we need from you",
    "position summary",
  ];

  let currentSection = "";
  const sections = {};

  for (const line of lines) {
    const heading = line
      .trim()
      .replace(/^[•*#-]\s*/, "")
      .replace(/:$/, "")
      .trim()
      .toLowerCase();

    if (relevantSections.includes(heading)) {
      currentSection = heading;
      sections[currentSection] ??= [];
      continue;
    }

    if (currentSection) {
      sections[currentSection].push(line);
    }
  }

  // 4. Check explicit position-identification phrases
  for (const item of seniorityPatterns) {
    const roleRegex = new RegExp(
      String.raw`\b(?:${item.pattern})\s+${rolePattern}\b`,
      "i",
    );

    const explicitPhrases = [
      // We are looking for a Senior Developer
      new RegExp(
        String.raw`\b(?:we are looking for|we're looking for|we seek|we are seeking|we're seeking|hiring|seeking)\s+(?:an?\s+)?${roleRegex.source}`,
        "i",
      ),

      // As a Mid-Level Software Engineer
      new RegExp(
        String.raw`\b(?:as|for)\s+(?:an?\s+)?${roleRegex.source}`,
        "i",
      ),

      // Senior Developer position
      new RegExp(
        String.raw`${roleRegex.source}\s+(?:position|role|opening|vacancy)\b`,
        "i",
      ),

      // This is a senior-level position
      new RegExp(
        String.raw`\b(?:this|the)\s+(?:is\s+)?(?:an?\s+)?${item.pattern}\s+(?:role|position|job)\b`,
        "i",
      ),
    ];

    // Search the complete description for strong phrases
    if (explicitPhrases.some((regex) => regex.test(description))) {
      return item.level;
    }

    // 5. Special handling for "We are looking for" section.
    // A standalone "Senior Developer" bullet is acceptable here.
    const hiringSection = sections["we are looking for"]?.join(" ");

    if (hiringSection && roleRegex.test(hiringSection)) {
      return item.level;
    }
  }

  return null;
}
