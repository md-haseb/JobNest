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
              className="filter-location-select"
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
        </div>
      </section>
      <div id="search-and-job-listing-container">Hello</div>
    </main>
  );
}

export default Main;
