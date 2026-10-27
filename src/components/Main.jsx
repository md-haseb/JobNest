import "./Main.css";
import { SlidersHorizontal } from "lucide-react";

function Main() {
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

          <form className="job-search-form">
            <input
              type="search"
              name="search"
              placeholder="Job title, skill, or company..."
            />
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
          {/* Render reusable JobCard components here */}
        </div>

        {/* 4. Load more jobs */}
        <div className="load-more-container">
          <button type="button">Load More Jobs</button>
        </div>
      </section>
    </main>
  );
}

export default Main;
