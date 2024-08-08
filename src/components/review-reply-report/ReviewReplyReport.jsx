import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "./review-reply.css";
import { SharedContext } from "../../context/SharedContext";

library.add(fas);

const ReviewReplyReport = () => {
  const { getDrName } = useContext(SharedContext);
  const api = localStorage.getItem("API");
  const [docData, setDocData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRating, setSelectedRating] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;
  const pagesPerBlock = 10;

  useEffect(() => {
    if (getDrName) {
      async function getDocData() {
        const response = await fetch(api + "/docData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ businessName: getDrName }),
        });
        const data = await response.json();
        setDocData(data.fullReview);
        filterComments("ALL", data.fullReview);
      }
      getDocData();
    }
  }, [getDrName, api]);

  const filterComments = (rating, data = docData) => {
    setSelectedRating(rating);
    setCurrentPage(1);

    let allComments = [];
    if (rating === "ALL") {
      allComments = Object.values(data).flat();
    } else {
      allComments = data[rating] || [];
    }
    setFilteredData(allComments);
  };

  const handleError = (e) => {
    e.target.src = require("../../assets/profile/doc.png");
  };

  const paginate = (data) => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    return data.slice(startIndex, startIndex + commentsPerPage);
  };

  const renderComments = () => {
    if (!Array.isArray(filteredData)) return null;

    const paginatedData = paginate(filteredData);

    return paginatedData.map((comment, index) => {
      let ratingParsed;
      if (comment.rating === "FIVE") {
        ratingParsed = 5;
      } else if (comment.rating === "FOUR") {
        ratingParsed = 4;
      } else if (comment.rating === "THREE") {
        ratingParsed = 3;
      } else if (comment.rating === "TWO") {
        ratingParsed = 2;
      } else if (comment.rating === "ONE") {
        ratingParsed = 1;
      }

      return (
        <div key={index} className="first-card">
          <div className="first-card-profile">
            <div>
              <img
                src={comment.rprofilePhotoUrl}
                alt="Profile"
                onError={handleError}
                style={{ height: "40px", width: "40px" }}
              />
            </div>
            <div className="profile-name">
              {comment.rname}
              <div className="reply-stars">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon="star"
                    style={{
                      color: i < ratingParsed ? "#f2d11f" : "#e0e0e0",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="card-profile-comment">{comment.comment}</div>
        </div>
      );
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextBlock = () => {
    setCurrentPage((prevPage) => prevPage + pagesPerBlock);
  };

  const handlePrevBlock = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - pagesPerBlock, 1));
  };

  const renderPagination = () => {
    const totalComments = filteredData.length;
    const totalPages = Math.ceil(totalComments / commentsPerPage);
    const currentBlock = Math.ceil(currentPage / pagesPerBlock);
    const startPage = (currentBlock - 1) * pagesPerBlock + 1;
    const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <>
        {currentBlock > 1 && (
          <button className="pagination-button" onClick={handlePrevBlock}>
            Previous
          </button>
        )}
        {pages}
        {endPage < totalPages && (
          <button className="pagination-button" onClick={handleNextBlock}>
            Next
          </button>
        )}
      </>
    );
  };

  return (
    <div className="review-reply-root">
      <div className="star-ratings-reply-button">
        {["ALL", "FIVE", "FOUR", "THREE", "TWO", "ONE"].map((rating, index) => (
          <button
            key={index}
            className="reply-buttons"
            onClick={() => filterComments(rating)}
          >
            {rating === "ALL" ? "All" : `${6 - index}`}
            <FontAwesomeIcon icon="star" />
          </button>
        ))}
      </div>
      <div className="rating-cards">{renderComments()}</div>
      <div className="pagination">{renderPagination()}</div>
    </div>
  );
};

export default ReviewReplyReport;
