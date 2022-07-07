import './../styles/App.css';
import {
  BrowserRouter as Router,
  Routes,
  NavLink,
  Route,
} from "react-router-dom";
import Evaluator from './Evaluator';
import Home from './Home';
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
      </NavUnlisted>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evaluator" element={<div id="main"><Evaluator /></div>} />
      </Routes>
    </Router>
  );
}

export default App;
