import React, { Component } from 'react'
import StoryCard from '../components/StoryCard'
import SideMenu from '../components/SideMenu'

const FAKE_STORIES = [
  {
    id: 1,
    slug: 'video_fake_story',
    count: '01',
    title: 'A cool story',
    image: 'https://luxptt.dhlab.lu/media/home-luxembourgmonnet1980001.jpg',
    description: 'Mellon Collie and the Infinite Sadness'
  },
  {
    id: 2,
    slug: 'video_fake_story',
    count: '01',
    image: 'https://luxptt.dhlab.lu/media/home-eschsuralzette15juin1995001.jpg',
    title: 'A cool story',
    description: 'Mellon Collie and the Infinite Sadness'
  },
  {
    id: 3,
    slug: 'video_fake_story',
    count: '01',
    title: 'A cool story',
    image: 'https://luxptt.dhlab.lu/media/home-brochuretlphonesansdateintrieur.jpg',
    description: 'Mellon Collie and the Infinite Sadness'
  },
  {
    id: 4,
    slug: 'video_fake_story',
    count: '01',
    title: 'A cool story',
    image: 'https://luxptt.dhlab.lu/media/home-brochuretlphonesansdateintrieur.jpg',
    description: 'Mellon Collie and the Infinite Sadness'
  }
]

export default class Stories extends Component {
  render() {
    return (
      <div className='h-100'>
        <SideMenu />
        <div className='h-100 with-sidemenu'>
          <div className='bg-dark text-white p-2'>
            <h1>Dossiers thématique</h1>
          </div>
          <div className='d-flex h-100' style={{ overflowY: 'auto' }}>
            {FAKE_STORIES.map(story => (
              <StoryCard
                key={story.id}
                {...story}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}
