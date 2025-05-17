import React from 'react'

const EMptyCard = (imgSrc,message) => {
  return (
    <div>
        <img src={imgSrc} alt="No notes" className='w-60' />
    </div>
  )
}

export default EMptyCard