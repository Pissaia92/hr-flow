import React from 'react';
import OriginalNavbar from '@theme-original/Navbar';
import CustomLogo from '../../components/CustomLogo';

export default function Navbar(props) {
  return (
    <OriginalNavbar
      {...props}
      logo={<CustomLogo />}
    />
  );
}
