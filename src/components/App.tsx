import './../styles/App.css';
import {
  BrowserRouter as Router,
  Routes,
  NavLink,
  Route,
} from "react-router-dom";
import Evaluator from './Evaluator';
import ManualEval from './ManualEval';
import ManualEval2 from './ManualEval2';
import Home from './Home';
import EditBin from './EditBin';
import PickHandler from './PickHandler';
import styled from '@emotion/styled';

const NavUnlisted = styled.ul`

  display: flex;

  a {
    text-decoration: none;
  }

  li {
    color: blue;
    margin: 0 0.8rem;
    font-size: 1.3rem;
    position: relative;
    list-style: none;
  }

  .current {
    li {
      border-bottom: 2px solid black;
    }
  }
`;
function App() {
  return (
    <Router>
      <NavUnlisted>
          <NavLink to="/">
            <li>Home</li>
          </NavLink>
          <NavLink to="/evaluator">
            <li>Evaluator</li>
          </NavLink>
          <NavLink to="/manualevaluation">
            <li>Manual Evaluation</li>
          </NavLink>
          <NavLink to="/manualevaluation2">
            <li>Manual Evaluation 2.0</li>
            </NavLink>
          <NavLink to="/pickhandler">
            <li>Pick Handler</li>
          </NavLink>
      </NavUnlisted>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evaluator" element={<div id="main"><Evaluator /></div>} />
        <Route path="/manualevaluation" element={<ManualEval />} />
        <Route path="/manualevaluation2" element={<ManualEval2 />} />
        <Route path="/manualevaluation/editBin/:binId" element={<EditBin />} />
        <Route path="/pickhandler" element={<PickHandler />} />
      </Routes>
    </Router>
  );
}

export default App;
