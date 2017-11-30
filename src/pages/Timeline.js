import React, { PureComponent } from 'react'
import { range } from 'lodash'
import { StaggeredMotion, spring, presets } from 'react-motion'

const timeline = [
  {
    text: 'Jump',
    color: 'orange',
  },
  {
    text: 'Down',
    color: 'teal',
  },
  {
    text: 'Turn',
    color: 'silver',
  },
  {
    text: 'Around',
    color: 'hotpink',
  },
  {
    text: 'Pick',
    color: 'khaki'
  },
  {
    text: 'A Ball',
    color: 'purple',
  },
  {
    text: 'Of Cotton',
    color: 'deepskyblue'
  }
]

class Timeline extends PureComponent {
  render() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
        <StaggeredMotion
          defaultStyles={range(timeline.length).map(_ => ({ t: -100 }))}
          styles={prevStyles => prevStyles.map((_, i) => (
            i === 0 ? { t: spring(0, presets.gentle) } : { t: spring(prevStyles[i - 1].t, presets.gentle) }
          ))}
        >
          {styles =>
            <div>
            {styles.map((s, i) => (
            <div key={i} style={{ height: 30, width: 100, textAlign: 'center', backgroundColor: timeline[i].color, marginTop: s.t }}>
              {timeline[i].text}
            </div>
          ))}
        </div>
        }
        </StaggeredMotion>
        </div>
    )
  }
}

export default Timeline
