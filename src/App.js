import { BrowserRouter, Routes, Route } from "react-router-dom"
import AddSchools from "./components/AddSchool"
import Dashboard from "./components/Dashboard"
import Login from "./components/Login"
import AddUsers from "./components/AddUsers"
import SearchScoreboard from "./components/SearchScoreboard"
import ScoreDetails from "./components/ScoreDetails"
import ScoreboardMode1 from "./components/ScoreboardMode1"
import ScoreboardMode2 from "./components/ScoreboardMode2"
import ScoreboardMode3 from "./components/ScoreboardMode3"
import AddPoints from "./components/AddPoints"


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-school" element={<AddSchools />} />
                <Route path="/search-scoreboard" element={<SearchScoreboard />} />
                <Route path="/add-users" element={<AddUsers />} />
                <Route path="/score-details" element={<ScoreDetails />} />
                <Route path="/scoreboard-mode1" element={<ScoreboardMode1 />} />
                <Route path="/scoreboard-mode2" element={<ScoreboardMode2 />} />
                <Route path="/scoreboard-mode3" element={<ScoreboardMode3 />} />
                <Route path="/add-points" element={<AddPoints />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App