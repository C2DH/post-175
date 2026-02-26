import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import './Search.scss'

const getSuggestionValue = suggestion => suggestion

const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
)

const bootstrapTheme = {
  container:                'react-autosuggest__container',
  containerOpen:            'react-autosuggest__container--open',
  input:                    'form-control react-autosuggest__input',
  inputOpen:                'react-autosuggest__input--open',
  inputFocused:             'react-autosuggest__input--focused',
  suggestionsContainer:     'react-autosuggest__suggestions-container',
  suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
  suggestionsList:          'react-autosuggest__suggestions-list',
  suggestion:               'react-autosuggest__suggestion',
  suggestionFirst:          'react-autosuggest__suggestion--first',
  suggestionHighlighted:    'react-autosuggest__suggestion--highlighted',
  sectionContainer:         'react-autosuggest__section-container',
  sectionContainerFirst:    'react-autosuggest__section-container--first',
  sectionTitle:             'react-autosuggest__section-title'
}

export default class Search extends Component {

  onSuggestionsFetchRequested = ({ value }) => {
    this.props.searchSuggestions(value)
  }

  onSuggestionsClearRequested = () => {
    this.props.clearSuggestions()
  }

  render() {
    const { value, onChange, placeholder, suggestions, ...passProps } = this.props
    const inputProps = {
      placeholder,
      value,
      onChange,
    }

    return (
      <Autosuggest
        theme={bootstrapTheme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        {...passProps}
      />
    )
  }
}
