// utils.js
export const calculateAverageRatings = (datasets) => {
  const numHospitals = datasets.length;
  const averages = [0, 0, 0, 0, 0];

  datasets.forEach((dataset) => {
    dataset.data.forEach((value, index) => {
      averages[index] += value;
    });
  });

  return averages.map((total) => total / numHospitals);
};
