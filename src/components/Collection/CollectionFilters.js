import React, { PureComponent } from 'react'
import debounce from 'lodash/debounce'
import { localize } from '../../localize'
import { COLLECTION_DATE_TYPES } from '../../consts'
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

  handleOnSearchChange = e => {
    const text = e.target.value
    this.setState({
      searchText: text,
    }, () => {
      this.debouncedOnSearchChange(text)
    })
  }

  debouncedOnSearchChange = debounce(this.props.onSearchChange, 150)

  render() {
    const { categories, onToggleCategory, t } = this.props
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
          <input
            type='text'
            className='form-control'
            placeholder='Search'
            value={this.state.searchText}
            onChange={this.handleOnSearchChange}
          />
        </div>
      </div>
    )
  }
}

export default localize()(CollectionFilters)
