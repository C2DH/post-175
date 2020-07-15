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
  console.info(
    'POST-175 GA enabled:',
    process.env.REACT_APP_GA_CODE
  )
} else {
  console.info('POST-175 GA disabled by config.')
}

console.info(
  'POST-175 version:',
  process.env.REACT_APP_POST_175_GIT_BRANCH,
  process.env.REACT_APP_POST_175_GIT_REVISION
)

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
