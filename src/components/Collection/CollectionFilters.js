import React, { PureComponent } from 'react'
import debounce from 'lodash/debounce'
import './Collection.css'

const ALL_CATEGORIES = [
  {
    name: 'image',
  },
  {
    name: 'video',
  }
]

export default class CollectionFilters extends PureComponent {
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
    const { categories, onToggleCategory } = this.props
    return (
      <div className='collection-filters'>
        <div className='collection-filters-categories'>
          <div>CATEGORIES:</div>
          <div className='categories-radios'>
            {ALL_CATEGORIES.map(cat => (
              <div className='category-radio' key={cat.name}>
                <input
                  onChange={() => onToggleCategory(cat.name)}
                  type='checkbox'
                  checked={categories.indexOf(cat.name) !== -1}
                />
                <div className='radio-label'>{cat.name}</div>
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
