import React from 'react'
import PropTypes from 'prop-types';
import autoprefixer from 'autoprefixer';

function ReactSVG(props) {
  const { name, role = 'img', label, width, height, color,style={}, ...rest } = props;

  return (
    <svg {...rest} role={role} aria-label={label || name} style={{
        width: width+'px',
        height: height ? height+'px' : 'auto',
        fill: color ? color : '#333',
        ...style
      }}>
      <use xlinkHref={`#${name}`} />
    </svg>
  );
}

ReactSVG.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string,
  label: PropTypes.string,
};

export default ReactSVG
