import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './components/Home'
import TurbodotaProvider from './components/TurbodotaProvider'

export default function App() {

    function SearchResults() {
        return <h2>searchResults</h2>;
      }
    

  return (
    <TurbodotaProvider>
        <Router>
        <div>
            <nav>
            <ul>
                <li>
                <Link to="/">
                    Home
                </Link>
                </li>
            </ul>
            </nav>

            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
            <Route path="/">
                <Home />
            </Route>
            <Route path="/searchResults">
                <SearchResults />
            </Route>
            </Switch>
        </div>
        </Router>
    </TurbodotaProvider>
  );
}

