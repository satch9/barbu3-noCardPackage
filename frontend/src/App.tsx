import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import Login from './screens/login/Login';
import Register from './screens/register/Register';
import Home from './screens/home/Home';
import NewGame from './screens/newGame/NewGame';
import ListGame from './screens/listGame/ListGame';
import Game from './screens/game/Game';
import ScoreBoard from './screens/scoreBoard/ScoreBoard';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/newGame" element={<NewGame />} />
          <Route path="/listGame" element={<ListGame />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/scoreBoard" element={<ScoreBoard />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
