import React from 'react';
import CardView from 'react-native-cardview';

const cardView = (props) => {
  const {
    children, cvStyle, elevation, maxElevation,
    radius
  } = props;
  return (
    <CardView
      style={cvStyle}
      cardElevation={elevation || 2}
      cardMaxElevation={maxElevation || 2}
      cornerRadius={radius || 5}
    >
      { children }
    </CardView>
  );
};

export default cardView;
