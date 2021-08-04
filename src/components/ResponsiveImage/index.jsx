


import React, {useMemo} from 'react'
import style from './style.scss'

function ResponsiveImage(props) {

  const {source, name, ratio, width='100%', className='', style:pStyle} = props


  return (
    <div className={`${style.responsiveImage} ${className}`} style={{width, ...pStyle}}>
      <div className={`${style.responsiveImage}__wrapper`} style={{paddingTop: `${ratio*100}%`}}>
        <img  src={source} alt={name} />
      </div>
    </div>
  )
}

export default ResponsiveImage
