import React, { PureComponent } from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { localize } from '../localize'
import { clearOverPlace } from '../state/actions'

const colors = {
  yellow: {
    color: '#fdd00c',
  },
  green: {
    color: '#13d436',
  }
}


class MapTooltip extends PureComponent {
  render() {
    const { place, style, t } = this.props
    return (
      <div style={{...style}}
        className='d-flex flex-row'
        >
        <div className="cover"
          style={{background: `url(${get(place, 'documents[0].snapshot')}) no-repeat`, width: 100}}
        />
        <div className="h-100 bg-black p-2">
          {place.open
            ? <p className="m-0 font-12" style={colors.green}>{t('map_mapTooltipOpen')}</p>
            : <p className="m-0 font-12" style={colors.yellow}>{t('map_mapTooltipClose')}</p>}
          <p style={{fontSize: 18, color: '#d4d4d4', margin: 0}}>{place.data.title}</p>
          <div className="w-100 d-inline-flex flex-1">
            <div className="h-100" style={{paddingTop: 2, paddingRight: 3}}>
              <i className="material-icons font-12 text-grey">place</i>
            </div>
            <div className="h-100">
              <span className="font-14 text-grey">{place.data.address}</span>
            </div>
          </div>
          <span className="font-12">
            {place.data.start_date &&
            <span>{t('map_mapTooltipFrom')}: {new Date(place.data.start_date).getFullYear()}</span>}
            {place.data.end_date &&
             <span> - {t('map_mapTooltipTo')}: {new Date(place.data.end_date).getFullYear()}</span>}
          </span>

        </div>
      </div>
    )
  }
}

export default localize()(MapTooltip)
