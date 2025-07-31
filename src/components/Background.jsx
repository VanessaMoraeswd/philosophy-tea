import React from 'react'
import bgImage from '../assets/bg3.jpeg'

export function Background() {
  return (
    <div
      className='background-container'
      style={{
        backgroundImage: `url(${bgImage})`
      }}
    ></div>
  )
}
