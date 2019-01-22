import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import './StoryCard.scss'

export default memo(function StoryCard({ count, image, title, description, slug }) {
  return (
    <Link to={`/stories/${slug}`} className='story-card'>
      <div className='story-card-content'>
        <div className='count'>{count}</div>
        <div className='image' style={{ backgroundImage: `url('${image}')` }} />
        <h1 className='title'>{title}</h1>
        <div className='description'>{description}</div>
      </div>
    </Link>
  )
})
