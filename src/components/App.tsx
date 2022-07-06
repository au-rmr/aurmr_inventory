import './../styles/App.css';
import {
  BrowserRouter as Router,
  Routes,
  NavLink,
  Route,
} from "react-router-dom";
import Evaluator from './Evaluator';
import Home from './Home';

function App() {
  return (
    <Router>
      <ul className='navBar'>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/evaluator">Evaluator</NavLink>
        </li>
      </ul>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evaluator" element={<div id="main"><Evaluator /></div>} />
      </Routes>
    </Router>
  );
}

export default App;
