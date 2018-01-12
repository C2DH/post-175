import React, { PureComponent } from 'react'
import TopBar from './TopBar'
import { localize } from '../localize'

class LegendIntro extends PureComponent {
  render () {
    const { story, t } = this.props;
    return (
      <div className="d-flex flex-column overflow-auto" style={{ zIndex: 1, position: 'absolute', top: 0, bottom: 0 }}>
        <div className="w-100 p-3 bg-light">
          <h3>{t('map_legendIntro')}</h3>
        </div>
        <div className="w-100 flex-1 p-3 bg-white font-14">
          <p>
            {story?story.data.abstract:''}
          </p>
          <div className="d-flex flex-column">
            <div className="d-inline-flex">
              <svg width={30} height={30}>
                <circle cx="10" cy="10" r={9} fill="rgb(19, 212, 54)" />
              </svg>
              <span className="font-12">{t('map_officeOpen')}</span>
            </div>
            <div className="d-inline-flex">
              <svg width={30} height={30}>
                <circle cx="10" cy="10" r={9} fill="rgb(253, 208, 12)" />
              </svg>
              <span className="font-12">{t('map_officeClose')}</span>
            </div>
          </div>
        </div>
        <div className="w-100 h-100px p-3 bg-light">
          <span className="font-9 form-text">
            {story?story.data.legend:''}
          </span>
        </div>
      </div>
    )
  }
}

export default localize()(LegendIntro)
