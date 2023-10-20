import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/chat/index";
import { UserProvider } from "./hooks/userContext";

function App() {
  return (
    <>
      <div className="overlay"></div>
      <Router>
        <div className="App">
          <UserProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </UserProvider>
        </div>
      </Router>
    </>
  );
}

export default App;
