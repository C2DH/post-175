import React from "react";
import { Provider } from "react-redux";
import I18n from "redux-i18n";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import store from "./state";
import Root from "./components/Root";
import translations from "./translations";

const history = createBrowserHistory();

console.info(
  'POST-175 version:',
  process.env.REACT_APP_GIT_TAG,
  process.env.REACT_APP_GIT_BRANCH,
  process.env.REACT_APP_GIT_REVISION
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
