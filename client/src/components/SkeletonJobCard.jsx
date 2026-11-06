import "./SkeletonJobCard.css";

function SkeletonJobCard() {
  return (
    <div className="skeleton-job-card">
      <div className="skeleton-logo skeleton"></div>

      <div className="skeleton-job-info">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-company"></div>

        <div className="skeleton-details">
          <div className="skeleton skeleton-detail"></div>
          <div className="skeleton skeleton-detail"></div>
          <div className="skeleton skeleton-detail"></div>
        </div>
      </div>

      <div className="skeleton-save skeleton"></div>
    </div>
  );
}

export default SkeletonJobCard;
