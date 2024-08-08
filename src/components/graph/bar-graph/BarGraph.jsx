import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { SharedContext } from "../../../context/SharedContext";

import AnalysisGraph from "../analysis-graph/AnalysisGraph";
const BarGraph = () => {
  const { getDrName } = useContext(SharedContext);
  const api = localStorage.getItem("API");
  const [docData, setDocData] = useState(null);

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

  const getDataForGraph = () => {
    if (!docData) return {};

    const ratingsData = ratings.map((rating) => docData[rating].length);

    return {
      labels: ["Five Star", "Four Star", "Three Star", "Two Star", "One Star"],
      datasets: [
        {
          label: "Number of Ratings",
          backgroundColor: [
           
            "#0a8024",           
            "#41d962",
            "#fae105",
            " #f26602",            
            "#f51d11",
           
          ],
         
          borderWidth: 1,
      data: ratingsData,
        },
      ],
    };
  };

  return (
    <div style={{ width: "400px", height: "300px", margin: "20px 10px 0px 400px" }}>
      <h2 style={{ fontSize: "14px", marginBottom: "10px" }}>
        Bar Graph for Ratings
      </h2>
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
  );
};

export default BarGraph;
