import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { searchSuggestions, clearSuggestions } from '../../state/actions'
import debounce from 'lodash/debounce'
import { localize } from '../../localize'
import { COLLECTION_DATE_TYPES } from '../../consts'
import Search from './Search'
import './Collection.css'

class CollectionFilters extends PureComponent {
  state = {
    prevLocationKey: this.props.locationKey,
    searchText: this.props.search
  }

  static getDerivedStateFromProps(props, state) {
    if (state.prevLocationKey !== props.locationKey) {
      if (state.searchText !== props.search) {
        return {
          searchText: props.search,
          prevLocationKey: props.locationKey,
        }
      }
      return {
        prevLocationKey: props.locationKey,
      }
    }
    return null
  }

  handleOnSearchChange = (e, { newValue }) => {
    this.setState({
      searchText: newValue,
    }, () => {
      this.debouncedOnSearchChange(newValue)
    })
  }

  onSuggestionSelected = (e, { suggestion }) => {
    this.setState({
      searchText: suggestion,
    }, () => {
      this.props.onSearchChange(suggestion)
    })
  }

  debouncedOnSearchChange = debounce(this.props.onSearchChange, 150)

  debouncedSearchSuggestions = debounce(this.props.searchSuggestions, 150)

  render() {
    const {
      categories, onToggleCategory, suggestions, clearSuggestions, t
    } = this.props

    return (
      <div className='collection-filters'>
        <div className='collection-filters-categories'>
          <div>CATEGORIES:</div>
          <div className='categories-radios'>
            {COLLECTION_DATE_TYPES.map(name => (
              <div className='category-radio' key={name}>
                <input
                  onChange={() => onToggleCategory(name)}
                  type='checkbox'
                  checked={categories.indexOf(name) !== -1}
                />
                <div className='radio-label'>{t(name)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className='collection-filters-search'>
          <Search
            placeholder='Search'
            onSuggestionSelected={this.onSuggestionSelected}
            searchSuggestions={this.debouncedSearchSuggestions}
            clearSuggestions={clearSuggestions}
            suggestions={suggestions}
            value={this.state.searchText}
            onChange={this.handleOnSearchChange}
          />
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  suggestions: state.searchSuggestion.results,
}), {
  searchSuggestions,
  clearSuggestions
})(localize()(CollectionFilters))
