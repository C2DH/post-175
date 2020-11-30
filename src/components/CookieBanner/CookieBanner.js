import React, { PureComponent, Fragment } from 'react';
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import { Container, Row, Col } from 'reactstrap';
import { withCookies } from 'react-cookie';
import ReactGA from "react-ga";
import { localize } from "../../localize";
import { getSelectedLang } from "../../state/selectors";

import './CookieBanner.scss';

class CookieBanner extends PureComponent {

  initGA() {
    const { history } = this.props;

    // integrate history \w Google Analytics
    if (process.env.REACT_APP_GA_CODE) {
      ReactGA.initialize(process.env.REACT_APP_GA_CODE, {
        gaOptions: {
          cookieFlags: 'secure'
        }
      });
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
  }

  setCookie(status) {
    this.props.cookies.set('cookieconsent', status , {
      path: '/',
      expires: new Date(Date.now() + 365 * 24 * 3600 * 1000),
      sameSite: 'Lax'
    });
  }

  accept = () => {
    this.setCookie('accept');
    this.initGA();
  }

  componentDidMount() {
    if(this.props.cookies.get('cookieconsent') === 'accept')
      this.initGA();
  }

  render() {

    const { t, cookies, selectedLang } = this.props;

    return (
      <Fragment>
        {!cookies.get('cookieconsent') &&
          <Container fluid className="CookieBanner">
            <Row className="align-items-center">
              <Col className='message'>
                {t("cookies")}
                <NavLink
                  to={{
                    pathname: "/terms-of-use",
                    search: `?lang=${selectedLang.param}`
                  }}
                  className="d-block"
                >
                  {t("read_more")}
                </NavLink>
              </Col>
              <Col md="auto" className="mt-2 mt-md-0">
                <a href="" className="not-accept link-label" onClick={() => this.setCookie('deny')}>
                  {t("not_accept")}
                </a>
                <button onClick={this.accept}>
                  {t("accept")}
                </button>
              </Col>
            </Row>
          </Container>
        }
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  selectedLang: getSelectedLang(state)
});

export default localize()(withRouter(withCookies(connect(mapStateToProps)(CookieBanner))));
