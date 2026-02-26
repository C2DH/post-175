import React, { PureComponent } from "react";
import TopBar from "../TopBar";
import LegendIntro from "../LegendIntro";
import LegendDetail from "../LegendDetail";
import { Motion, TransitionMotion, spring } from "react-motion";
import { localize } from "../../localize";
import "./Legend.scss";

class Legend extends PureComponent {
  render() {
    const { story, selectedPlace, onClose, t } = this.props;
    return (
      <div>
        <TransitionMotion
          defaultStyles={
            selectedPlace
              ? [
                  {
                    key: "place",
                    data: { selectedPlace, onClose },
                    style: { x: -500 }
                  }
                ]
              : []
          }
          styles={
            selectedPlace
              ? [
                  {
                    key: "place",
                    data: { selectedPlace, onClose },
                    style: { x: spring(0) }
                  }
                ]
              : []
          }
          willLeave={() => ({ x: spring(-500) })}
          willEnter={() => ({ x: -500 })}
        >
          {styles => (
            <div>
              {styles.map(
                ({ style: { x }, key, data: { selectedPlace, onClose } }) => (
                  <LegendDetail
                    key={key}
                    style={{ left: x }}
                    place={selectedPlace}
                    onClose={onClose}
                  />
                )
              )}
            </div>
          )}
        </TransitionMotion>
      </div>
    );
  }
}

export default localize()(Legend);
