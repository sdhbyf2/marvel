import "./App.css";
import CharactersList from "./components/CharactersList";
import Characters from "./components/Characters";
import Error from "./components/Error";
import SearchResult from "./components/SearchResult";
import logo from "./logo.png";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="headerContent">
            <img src={logo} className="App-logo center" alt="logo" />
            <h1 className="App-title">
              A simple web application which navigates to Marvel Characters
              Records
            </h1>
            <h3 className="App-title2">
              This application shows Name, Description, Image, List of Stories,
              Events and Series of the Characters
            </h3>
            <div className="header-links alignCenter">
              <Link className="showlink" to="/characters/page/0">
                Characters
              </Link>
            </div>
            <div className="text-align-home"></div>
          </div>
        </header>
        <div className="App-body">
          <Route
            exact
            path="/characters/page/:page"
            component={CharactersList}
          />
          <Route exact path="/characters/:id" component={Characters} />
          <Route exact path="/error/:errorMsg" component={Error} />
          <Route
            exact
            path="/search/:listing/:query"
            component={SearchResult}
          />
        </div>
      </div>
    </Router>
  );
}

export default App;
