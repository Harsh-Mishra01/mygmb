// App.js
import React from "react";
import RatingBarChart from "./RatingBarChart";
import HalfCircleChart from "./HalfCircleChart";
import { calculateAverageRatings } from "./utils";

const FinalAnalysis = () => {
  const datasets = [
    {
      label: "Hospital 1",
      data: [20, 15, 20, 5, 40],
    },
    {
      label: "Hospital 2",
      data: [30, 20, 10, 20, 20],
    },
    {
      label: "Hospital 3",
      data: [10, 30, 20, 10, 20],
    },
    {
      label: "Hospital 4",
      data: [5, 15, 15, 30, 35],
    },
    {
      label: "Hospital 5",
      data: [25, 5, 35, 5, 30],
    },
  ];

  return (
    <div>
      <HalfCircleChart datasets={datasets} />
    </div>
  );
};

export default FinalAnalysis;
