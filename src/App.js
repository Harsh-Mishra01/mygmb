import 'bootstrap/dist/css/bootstrap.css'
import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import DocReport from './pages/DocReport';
import Review from './pages/Review';
import './App.css'


function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
          <Route path="/Doc-report" element={<DocReport />} />
          <Route path="/Review Management" element={<Review />} />
        </Routes>
      </HashRouter>
      
    </>
  );
}

export default App;
