// HalfCircleChart.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { calculateAverageRatings } from "./utils";

ChartJS.register(ArcElement, Tooltip, Legend);

const HalfCircleChart = ({ datasets }) => {
  const averages = calculateAverageRatings(datasets);

  const data = {
    labels: ["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"],
    datasets: [
      {
        label: "Average Rating",
        data: averages,
        backgroundColor: [
          "#0c8227",
          "#17e848",
          "#ede61c",
          "#fa9519",
          "#b30b19",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: false,
      },
      title: {
        display: true,
        text: "Average Hospital Ratings",
      },
    },
  };

  return (
    <div
      style={{ width: "400px", height: "300px", margin: "0px 10px 40px 200px" }}
    >
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default HalfCircleChart;
