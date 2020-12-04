import React, { PureComponent, Fragment } from 'react';
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import { Container, Row, Col } from 'reactstrap';
import { withCookies } from 'react-cookie';
import ReactGA, { ga } from "react-ga";
import { localize } from "../../localize";
import { getSelectedLang } from "../../state/selectors";
import { setCookie, getBooleanCookie } from "../../utils";
import GAOptInOut, { GA_CONSENT_COOKIE } from './GAOptInOut';

import './CookieBanner.scss';


const ACCEPT_COOKIE = 'accepts-cookies';
class CookieBanner extends PureComponent {

  ga

  initGA() {
    const { history } = this.props;

    // integrate history \w Google Analytics
    if (process.env.REACT_APP_GA_CODE) {
      ReactGA.initialize(process.env.REACT_APP_GA_CODE, {
        gaOptions: {
          cookieFlags: 'samesite=lax'
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

  accept = () =>
    setCookie(this.props.cookies, ACCEPT_COOKIE, true);

  componentDidUpdate(prevProps) {

    const { cookies } = this.props;
    const gaConsent   = getBooleanCookie(cookies, ACCEPT_COOKIE) && getBooleanCookie(cookies, GA_CONSENT_COOKIE, true);

    if(!ga() && gaConsent)
      this.initGA();
    window[`ga-disable-${process.env.REACT_APP_GA_CODE}`] = !gaConsent;
  }

  render() {

    const { t, cookies, selectedLang } = this.props;

    return (
      <Fragment>
        {!cookies.get(ACCEPT_COOKIE) &&
          <Container fluid className="CookieBanner">
            <Row className="align-items-center">
              <Col className='message'>
                {t("cookies")}
                <NavLink
                  to={{
                    pathname: "/terms-of-use",
                    search: `?lang=${selectedLang.param}`
                  }}
                  className="ml-2 text-nowrap"
                >
                  {t("read_more")}
                </NavLink>
                <GAOptInOut />
              </Col>
              <Col md="auto" className="mt-2 mt-md-0">
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
