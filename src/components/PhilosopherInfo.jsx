import React from 'react'
import { philosophersData } from '../data/philosophers'
import '../styles/PhilosopherInfo.css'

export function PhilosopherInfo({ philosopherId, onClose }) {
  const philosopher = philosophersData.find(p => p.id === philosopherId)

  if (!philosopher) {
    return null
  }

  return (
    <div className='philosopher-info-overlay'>
      <div className='philosopher-info-card'>
        <button className='close-button' onClick={onClose}>
          X
        </button>
        <img
          src={philosopher.image}
          alt={philosopher.name}
          className='philosopher-image'
        />
        <h3 className='philosopher-name'>{philosopher.name}</h3>
        <p className='philosopher-bio'>{philosopher.bio}</p>
      </div>
    </div>
  )
}
