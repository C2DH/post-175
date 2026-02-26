// Fixed for React 19 - redux-i18n uses legacy context API
// This implementation uses react-redux connect instead
import React from 'react'
import { connect } from 'react-redux'
import { getTranslateFunction } from 'redux-i18n'

export function localize(propName = 't') {
  return function wrapWithLocalized(WrappedComponent) {
    const mapStateToProps = (state) => ({
      [propName]: getTranslateFunction(state.i18nState),
    })

    return connect(mapStateToProps)(WrappedComponent)
  }
}
