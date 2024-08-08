// RatingBarChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RatingBarChart = () => {
  const data = {
    labels: ["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"],
    datasets: [
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
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Hospital Ratings",
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  return (
    <div
      style={{ width: "400px", height: "300px", margin: "20px 10px 5px 400px" }}
    >
      <Bar data={data} options={options} />
    </div>
  );
};

export default RatingBarChart;
