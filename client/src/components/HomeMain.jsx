import "./HomeMain.css";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchJobs } from "../services/jobsService.js";
import SkeletonJobCard from "./SkeletonJobCard";
import JobCard from "./JobCard/JobCard.jsx";

function HomeMain() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // Search button handler
  function handleSearch(e) {
    e.preventDefault();
    setActiveSearch(searchTerm.trim());
  }

  function handleClearSearch() {
    setSearchTerm("");
    setActiveSearch("");
  }

  // Search logic
  const filteredJobs = jobs.filter((job) => {
    const searchContent = `
      ${job.job_title}
      ${job.employer_name}
    `.toLowerCase();

    return searchContent.includes(activeSearch.toLowerCase());
  });

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await fetchJobs();
        console.log(data);
        setJobs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return (
    <main id="jobnest-main-container">
      <section id="filter-container" aria-labelledby="filter-heading">
        <div className="filter-header-container">
          <div className="filter-icon-and-text">
            <SlidersHorizontal size={18} />
            <h2 id="filter-heading">Filters</h2>
          </div>

          <button type="button" className="filter-clear-btn">
            Clear All
          </button>
        </div>
        <div className="filter-options-container">
          {/* Employment Type */}
          <div className="filter-group">
            <h3>Employment Type</h3>

            <label className="filter-option">
              <input type="checkbox" name="employmentType" value="FULLTIME" />
              <span>Full-time</span>
            </label>

            <label className="filter-option">
              <input type="checkbox" name="employmentType" value="PARTTIME" />
              <span>Part-time</span>
            </label>

            <label className="filter-option">
              <input type="checkbox" name="employmentType" value="CONTRACTOR" />
              <span>Contract</span>
            </label>

            <label className="filter-option">
              <input type="checkbox" name="employmentType" value="INTERN" />
              <span>Internship</span>
            </label>
          </div>

          {/* Experience Level */}
          <div className="filter-group">
            <h3>Experience Level</h3>

            <label className="filter-option">
              <input
                type="checkbox"
                name="experienceLevel"
                value="no_experience"
              />
              <span>No experience</span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                name="experienceLevel"
                value="under_3_years_experience"
              />
              <span>Under 3 years</span>
            </label>

            <label className="filter-option">
              <input
                type="checkbox"
                name="experienceLevel"
                value="more_than_3_years_experience"
              />
              <span>More than 3 years</span>
            </label>
          </div>

          {/* Location Dropdown */}
          <div className="filter-group">
            <h3>Location</h3>

            <select
              id="job-location"
              name="location"
              className="filter-select"
              defaultValue=""
            >
              <option value="" disabled>
                Select location
              </option>
              <option value="Barisal">Barisal</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Khulna">Khulna</option>
              <option value="Mymensingh">Mymensingh</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Date Posted Dropdown */}
          <div className="filter-group">
            <h3>Date Posted</h3>

            <select
              id="date-posted"
              name="datePosted"
              className="filter-select"
              defaultValue="all"
            >
              <option value="all">Any time</option>
              <option value="today">Past 24 hours</option>
              <option value="3days">Past 3 days</option>
              <option value="week">Past week</option>
              <option value="month">Past month</option>
            </select>
          </div>

          {/* Salary Range */}
          <div className="filter-group">
            <h3>Salary Range (৳/month)</h3>

            <div className="filter-salary-inputs">
              <input
                type="number"
                name="minSalary"
                placeholder="Minimum"
                min="0"
                className="filter-input"
              />

              <input
                type="number"
                name="maxSalary"
                placeholder="Maximum"
                min="0"
                className="filter-input"
              />
            </div>
          </div>

          {/* apply filter button */}
          <div className="filter-actions">
            <button type="button" className="filter-apply-btn">
              Apply Filters
            </button>
          </div>
        </div>
      </section>

      <section id="search-and-job-listing-container">
        {/* 1. Search bar container */}
        <div className="job-search-container">
          <h1>Find Your Next Tech Job</h1>
          <p>
            Discover developer and technology opportunities across Bangladesh.
          </p>

          <form className="job-search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs..."
              />

              {searchTerm && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <button type="submit">Search</button>
          </form>
        </div>

        {/* 2. Results toolbar */}
        <div className="job-results-toolbar">
          <p className="job-results-count">120 jobs found</p>

          <div className="job-sort-container">
            <label htmlFor="job-sort">Sort by</label>
            <select id="job-sort" name="sort" defaultValue="newest">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>
        </div>

        {/* 3. Job listings */}
        <div id="job-listings-container">
          {loading &&
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonJobCard key={index} />
            ))}

          {error && <p>{error}</p>}

          {!loading && !error && filteredJobs.length === 0 && (
            <p>No jobs found.</p>
          )}

          {!loading &&
            !error &&
            filteredJobs.map((job) => <JobCard key={job.job_id} job={job} />)}
        </div>

        {/* 4. Load more jobs */}
        <div className="load-more-container">
          <button type="button">Load More Jobs</button>
        </div>
      </section>
    </main>
  );
}

export default HomeMain;
