import React, { useContext, useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { SharedContext } from "../../../context/SharedContext";
import { Chart as ChartJS, ArcElement } from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";

import "./analysis-graph.css"

ChartJS.register(ArcElement);

const AnalysisGraph = () => {
  const { getDrName } = useContext(SharedContext);
  const api = localStorage.getItem("API");
  const [docData, setDocData] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (getDrName) {
      async function getDocData() {
        try {
          const response = await fetch(api + "/docData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ businessName: getDrName }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const data = await response.json();
          setDocData(data.fullReview);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }

      getDocData();
    }
  }, [api, getDrName]);

  const ratings = ["FIVE", "FOUR", "THREE", "TWO", "ONE"];
  const colors = ["#0a8024", "#41d962", "#fae105", "#f26602", "#f51d11"];

  const getDataForGraph = () => {
    if (!docData) return {};

    const ratingsData = ratings.map((rating) => docData[rating].length);

    return {
      labels: ["Five Star", "Four Star", "Three Star", "Two Star", "One Star"],
      datasets: [
        {
          label: "Number of Ratings",
          backgroundColor: "#70acb5", 
          borderColor:"#70acb5", 
          borderWidth: 1,
          data: ratingsData,
        },
      ],
    };
  };

  const getTotalRatings = () => {
    return ratings.reduce((total, rating) => total + (docData[rating]?.length || 0), 0);
  };

  const drawGauge = (ctx, docData) => {
    const totalRatings = getTotalRatings();
    let startAngle = Math.PI;
    let endAngle = Math.PI;
    const centerX = 150;
    const centerY = 150;
    const radius = 100;

    ctx.clearRect(0, 0, 300, 200);

    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, Math.PI, 2 * Math.PI, false);
    ctx.lineWidth = 0;
    ctx.strokeStyle = "#e0e0e0";
    ctx.stroke();

    ratings.forEach((rating, index) => {
      const percentage = docData[rating].length / totalRatings;
      endAngle = startAngle + Math.PI * percentage;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
      ctx.lineWidth = 20;
      ctx.strokeStyle = colors[index];
      ctx.stroke();
      startAngle = endAngle;
    });

    ctx.fillStyle = "hoveredRating.color";
    ctx.font = "16px Arial";
    ctx.fillText(`Total Ratings: ${totalRatings}`, 100, 180);
  };

  const handleHover = (event) => {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = 150;
    const centerY = 150;
    const radius = 100;

    let startAngle = Math.PI;
    let endAngle = Math.PI;

    const angle = Math.atan2(y - centerY, x - centerX);
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    if (distance < radius - 10 || distance > radius + 10 || angle < Math.PI) {
      setHoveredRating(null);
      return;
    }

    const totalRatings = getTotalRatings();

    ratings.some((rating, index) => {
      const percentage = docData[rating].length / totalRatings;
      endAngle = startAngle + Math.PI * percentage;

      if (angle >= startAngle && angle <= endAngle) {
        setHoveredRating({ rating, count: docData[rating].length, color: colors[index] });
        return true;
      }

      startAngle = endAngle;
      return false;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx && docData) {
      drawGauge(ctx, docData);
    }
  }, [docData]);

  return (
    <div style={{ display: "flex", flexDirection: "row", marginBottom:"20px"}}>
      <div style={{ width: "700px", height: "350px", margin: "0px 10px 0px 100px", paddingBottom:"20px"  }}>
       
        {docData && (
          <Bar
            data={getDataForGraph()}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      precision: 0,
                    },
                  },
                ],
              },
            }}
          />
        )}
      </div>
      <div className="half-circle-graph" style={{display:"flex" , flexDirection: "column"}}>
      <div className="star-ratings">
        <h5 className="star">
          {" "}
          5
          <FontAwesomeIcon icon={["far", "star"]} style={{ color: "green" }} />
        </h5>
        {"       "}
        <h5 className="star">
          {" "}
          4
          <FontAwesomeIcon icon={["far", "star"]} style={{ color: "green" }} />
        </h5>
        {"  "}
        <h5 className="star">
          3
          <FontAwesomeIcon icon={["far", "star"]} style={{ color: "yellow" }} />
        </h5>
        {"  "}
        <h5 className="star">
          2
          <FontAwesomeIcon icon={["far", "star"]} style={{ color: "orange" }} />
        </h5>
        {"  "}
        <h5 className="star">
          1
          <FontAwesomeIcon icon={["far", "star"]} style={{ color: "red" }} />
        </h5>
      </div>
      <div style={{ width: "500px", height: "300px", margin: "10px 10px 80px 200px",  }}>
        <canvas
          ref={canvasRef}
          id="gauge"
          width="600"
          height="1000"
          onMouseMove={handleHover}
        ></canvas>
        {hoveredRating && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-60%, -60%)",
              backgroundColor: hoveredRating.color,
              padding: "5px 10px",
              borderRadius: "20px",
              color:hoveredRating.color,
              pointerEvents: "none",
            }}
          >
            {hoveredRating.rating} Star: {hoveredRating.count}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default AnalysisGraph;
