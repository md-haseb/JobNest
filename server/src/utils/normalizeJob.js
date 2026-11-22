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

    // salary: {
    //   salary: job.job_salary ?? null,
    //   min: job.job_min_salary ?? null,
    //   max: job.job_max_salary ?? null,
    // },

    salary:
      job.job_salary != null ||
      job.job_min_salary != null ||
      job.job_max_salary != null
        ? {
            salaryMin: job.job_min_salary ?? job.job_salary ?? null,
            salaryMax: job.job_max_salary ?? job.job_salary ?? null,
            currency: null,
            period: null,
          }
        : extractSalary(job.job_description),

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

const seniorityPatterns = [
  {
    level: "internship",
    pattern: String.raw`intern(?:ship)?|trainee`,
  },
  {
    level: "entry-level",
    pattern: String.raw`entry[- ]level|fresher|fresh graduate|graduate[- ]level|graduate trainee`,
  },
  {
    level: "junior",
    pattern: String.raw`junior(?:[- ]level)?|jr\.?`,
  },
  {
    level: "mid-level",
    pattern: String.raw`mid[- ]level|intermediate(?:[- ]level)?`,
  },
  {
    level: "senior",
    pattern: String.raw`senior(?:[- ]level)?|sr\.?`,
  },
  {
    level: "lead",
    pattern: String.raw`tech lead|team lead|lead(?:[- ]level)?|lead developer|lead engineer`,
  },
  {
    level: "principal",
    pattern: String.raw`principal`,
  },
  {
    level: "director",
    pattern: String.raw`director|head of`,
  },
];

function extractSeniority(title = "", description = "") {
  const normalizedTitle = title.toLowerCase();
  const normalizedDescription = description.toLowerCase();

  // 1. Check job title first (strongest signal)
  for (const item of seniorityPatterns) {
    const regex = new RegExp(`\\b(?:${item.pattern})\\b`, "i");

    if (regex.test(normalizedTitle)) {
      return item.level;
    }
  }

  // 2. Search description if title has no explicit seniority
  const descriptionSeniority = extractSeniorityFromDescription(
    normalizedDescription,
  );

  if (descriptionSeniority) {
    return descriptionSeniority;
  }

  // 3. Check required years of experience
  return extractSeniorityFromExperienceYears(normalizedDescription);
}

function extractSeniorityFromDescription(description = "") {
  if (!description) return null;

  // 1. Job-role keywords
  const rolePattern = String.raw`(?:(?:frontend|front-end|backend|back-end|full[- ]stack|software|web|technical|engineering|react|node\.?js|python|java|angular|dotnet|\.net)\s+){0,3}(?:developer|engineer|architect|designer|programmer|manager|specialist|consultant)`;

  // 2. Identify relevant sections
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

  // 3. Check explicit position-identification phrases
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

    // 4. Special handling for "We are looking for" section.
    // A standalone "Senior Developer" bullet is acceptable here.
    const hiringSection = sections["we are looking for"]?.join(" ");

    if (hiringSection && roleRegex.test(hiringSection)) {
      return item.level;
    }
  }

  return null;
}

function getRelevantExperienceText(description = "") {
  const lines = description.split(/\r?\n/);

  const relevantHeadings = [
    "requirements",
    "required qualifications",
    "qualifications",
    "work experience",
    "professional experience",
    "experience",
    "experience requirements",
    "required experience",
    "job requirements",
    "what we need from you",
    "what you bring",
    "who you are",
    "who we're looking for",
    "who we are looking for",
    "candidate requirements",
    "technical requirements",
  ];

  const irrelevantHeadings = [
    "about us",
    "about the company",
    "company overview",
    "company profile",
    "company culture",
    "responsibilities",
    "job responsibilities",
    "key responsibilities",
    "duties and responsibilities",
    "benefits",
    "what we offer",
    "what we provide",
    "job context",
  ];

  let isRelevantSection = false;
  const relevantLines = [];

  for (const line of lines) {
    const cleanedLine = line
      .trim()
      .replace(/^[•*#-]\s*/, "")
      .toLowerCase();

    const colonIndex = cleanedLine.indexOf(":");

    const heading =
      colonIndex === -1 ? cleanedLine : cleanedLine.slice(0, colonIndex).trim();

    const inlineContent =
      colonIndex === -1 ? "" : cleanedLine.slice(colonIndex + 1).trim();

    if (relevantHeadings.includes(heading)) {
      isRelevantSection = true;

      if (inlineContent) {
        relevantLines.push(inlineContent);
      }

      continue;
    }

    if (irrelevantHeadings.includes(heading)) {
      isRelevantSection = false;
      continue;
    }

    if (isRelevantSection) {
      relevantLines.push(line);
    }
  }

  // Limited fallback for descriptions without recognized headings.
  if (relevantLines.length === 0) {
    return lines
      .filter(
        (line) =>
          /\b\d{1,2}\s*\+?\s*(?:years?|yrs?)\b/i.test(line) &&
          /\b(?:professional|relevant|hands-on)\b/i.test(line) &&
          /\b(?:development|engineering|software|programming)\b/i.test(line),
      )
      .join("\n");
  }

  return relevantLines.join("\n");
}

function extractSeniorityFromExperienceYears(description = "") {
  if (!description) return null;

  const relevantText = getRelevantExperienceText(description);

  if (!relevantText) return null;

  const patterns = [
    {
      type: "range",
      regex:
        /\b(\d{1,2})\s*(?:-|–|—|to)\s*(\d{1,2})\s*\+?\s*(?:years?|yrs?)\b/gi,
    },
    {
      type: "maximum",
      regex:
        /\b(?:maximum|max(?:imum)?(?:\s+of)?|up\s+to)\s*(\d{1,2})\s*\+?\s*(?:years?|yrs?)\b/gi,
    },
    {
      type: "minimum",
      regex:
        /\b(?:at\s+least|minimum(?:\s+of)?|min\.?)\s*(\d{1,2})\s*\+?\s*(?:years?|yrs?)\b/gi,
    },
    {
      type: "plus",
      regex: /\b(\d{1,2})\s*\+\s*(?:years?|yrs?)\b/gi,
    },
    {
      type: "single",
      regex: /\b(\d{1,2})\s*(?:years?|yrs?)\b/gi,
    },
  ];

  const matches = [];

  for (const item of patterns) {
    for (const match of relevantText.matchAll(item.regex)) {
      matches.push({
        type: item.type,
        index: match.index,
        min: Number(match[1]),
        max: item.type === "range" ? Number(match[2]) : null,
      });
    }
  }

  // Use the first experience requirement mentioned.
  matches.sort((a, b) => a.index - b.index);

  const match = matches[0];

  if (!match) return null;

  // Ignore invalid ranges, such as 5–2 years.
  if (match.type === "range" && match.max < match.min) {
    return null;
  }

  if (match.type === "maximum") {
    return match.min <= 1 ? "junior" : null;
  }

  return classifyExperienceYears(match.min);
}

function classifyExperienceYears(min) {
  if (min <= 1) return "junior";

  if (min <= 4) return "mid-level";

  return "senior";
}

const salaryKeywords = /\b(salary|compensation|remuneration|pay)\b|বেতন/i;

const salaryPattern =
  /(?:\b(?:salary|compensation|remuneration|pay)\b|বেতন)\s*(?:range)?\s*[:：•-]?\s*(?:is\s*)?(?:BDT|৳|Tk\.?|Taka)?\s*(\d[\d,]*(?:\.\d+)?)\s*(k)?(?:\s*(?:-|–|—|to)\s*(?:BDT|৳|Tk\.?|Taka)?\s*(\d[\d,]*(?:\.\d+)?)\s*(k)?)?/i;

function parseSalaryAmount(amount, suffix) {
  const number = Number(amount.replace(/,/g, ""));

  return suffix ? number * 1000 : number;
}

function extractSalary(description = "") {
  const lines = description.split(/\r?\n/);

  for (const line of lines) {
    if (!/\b(salary|compensation|remuneration|pay)\b|বেতন/i.test(line)) {
      continue;
    }

    const match = line.match(salaryPattern);

    if (!match) continue;

    const salaryMin = parseSalaryAmount(match[1], match[2]);

    const salaryMax = match[3]
      ? parseSalaryAmount(match[3], match[4])
      : salaryMin;

    const currency = /BDT|৳|Tk\.?|Taka/i.test(match[0]) ? "BDT" : null;

    const period = /\b(monthly|per month)\b/i.test(line)
      ? "monthly"
      : /\b(annual|annually|yearly|per year)\b/i.test(line)
        ? "yearly"
        : null;

    return {
      salaryMin,
      salaryMax,
      currency,
      period,
    };
  }

  return null;
}
