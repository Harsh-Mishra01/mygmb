import React from "react";
import "./manage-review.css";

const ManageReview = () => {
  return (
    <div className="manage-review-root">
      <div>
        <h3 className="manage-review-title">
          Manage reviews effectively from place
        </h3>
        <div className="manage-review-card">
          <div className="reviews">
            <h4>Manage your reputation</h4>
            <p>
              Monitor new reviews for all your locations and get fast low-star
              review alerts.
            </p>
          </div>

          <div className="reviews">
            <h4>Reply to reviews</h4>
            <p>Respond quickly to reviews in Google from a single interface.</p>
          </div>

          <div className="reviews">
            <h4>Track your competitors</h4>
            <p>See competitors review base, reply rate and progress.</p>
          </div>
        </div>

        <button className="manage-review-btn">Manage reviews now</button>
      </div>
    </div>
  );
};

export default ManageReview;
