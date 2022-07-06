import './../styles/App.css';
import {
  BrowserRouter as Router,
  Routes,
  NavLink,
  Route,
} from "react-router-dom";

import Home from './Home';

function App() {
  return (
    <Router>
      <ul className='navBar'>
        <li>
          <NavLink exact to="/">Home</NavLink>
        </li>
      </ul>

      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
