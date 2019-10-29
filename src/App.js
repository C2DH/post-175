import React from "react";
import { Provider } from "react-redux";
import I18n from "redux-i18n";
import { createBrowserHistory } from "history";
import ReactGA from "react-ga";
import { Router } from "react-router-dom";
import store from "./state";
import Root from "./components/Root";
import translations from "./translations";

const history = createBrowserHistory();

// integrate history \w Google Analytics
if (process.env.REACT_APP_GA_CODE) {
  ReactGA.initialize(process.env.REACT_APP_GA_CODE);
  ReactGA.pageview(history.location.pathname + history.location.search);

  history.listen((location, action) => {
    ReactGA.pageview(location.pathname + location.search);
  });
}

const App = () => (
  <Provider store={store}>
    <I18n translations={translations} initialLang="fr">
      <Router history={history}>
        <Root />
      </Router>
    </I18n>
  </Provider>
);

export default App;
