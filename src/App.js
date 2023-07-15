import "./App.scss";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatContextProvider } from "./contexts/ChatContext";
import Routes from "./config/Routes";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <AuthProvider>
      <ChatContextProvider>
        <BrowserRouter>
          <div className="app">
            <Routes />
          </div>
        </BrowserRouter>
      </ChatContextProvider>
    </AuthProvider>
  );
}

export default App;
