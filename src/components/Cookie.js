import React, { PureComponent } from "react";
import CookieBanner from "react-cookie-banner";
import { localize } from "../localize";

class Cookie extends PureComponent {
  render() {
    const { children, t } = this.props;
    return (
      <React.Fragment>
        {children}
        <CookieBanner
          message={t("cookies")}
          buttonMessage={t("got it")}
          styles={{
            banner: {
              position: "fixed",
              bottom: 0,
              zIndex: 9999999,
              backgroundColor: "rgba(248, 201, 28, 0.9)",
              borderTop: "1px solid gray",
              height: "auto",
              textAlign: "left",
              padding: "15px 100px 15px 15px"
            },
            message: { fontWeight: 400, color: "black", lineHeight: "1" },
            button: {
              backgroundColor: "white",
              borderRadius: 999,
              top: "20%",
              marginTop: 6,
              padding: "4px 12px"
            }
          }}
          dismissOnScroll={true}
        />
      </React.Fragment>
    );
  }
}

export default localize()(Cookie);
