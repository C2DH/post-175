import React, { PureComponent } from 'react';
import { withCookies } from 'react-cookie';
import { Input } from 'reactstrap';

import { localize } from "../../localize";
import { setCookie, getBooleanCookie } from "../../utils";


export const GA_CONSENT_COOKIE = 'ga-consent';
class GAOptInOut extends PureComponent {

  setCookie = ({ target }) =>
    setCookie(this.props.cookies, GA_CONSENT_COOKIE, target.checked);

  render() {

    const { t, cookies } = this.props;

    return (
      <div className='custom-control custom-switch my-3'>
        <Input
          type 			= 'checkbox'
          className = 'custom-control-input'
          id 				= 'customSwitches'
          onChange  = {this.setCookie}
          checked   = {getBooleanCookie(cookies, GA_CONSENT_COOKIE, true)}
          readOnly
        />
        <label className='custom-control-label' htmlFor='customSwitches'>
          {t('ga_consent')}
        </label>
      </div>
    );
  }
}

export default localize()(withCookies(GAOptInOut));
