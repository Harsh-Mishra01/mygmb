
import "./reviewreportgraph.css";
import RatingBarChart from "./RatingBarChart";
import ManageReview from "../manage-review/ManageReview";
import FinalAnalysis from "./FinalAnalysis";
import BarGraph from "../graph/bar-graph/BarGraph";
import AnalysisGraph from "../graph/analysis-graph/AnalysisGraph";


const ReviewReportGraph = () => {
  return (
    <div className="star-ratings-root">
      <h4 className="star-ratings-title">Review Progress Report Sample </h4>
      
      <div className="review-graph">
        {/* <BarGraph /> */}
        <AnalysisGraph />
        {/* <RatingBarChart /> */}
        {/* <FinalAnalysis /> */}
      </div>
    </div>
  );
};

export default ReviewReportGraph;
