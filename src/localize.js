// Fixed bugged shit https://github.com/APSL/redux-i18n/issues/73
import { PureComponent, createElement } from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'

export function localize(propName = 't') {
  return function wrapWithLocalized(WrappedComponent) {
    class Localized extends PureComponent {
      static contextTypes = {
        t: PropTypes.func.isRequired
      }

      render() {
        return createElement(WrappedComponent, {
          ...this.props,
          [propName]: this.context.t
        })
      }
    }

    return hoistStatics(Localized, WrappedComponent)
  }
}
