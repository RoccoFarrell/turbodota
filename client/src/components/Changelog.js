import React from 'react';
import {
  Container
} from 'semantic-ui-react'
import './Changelog.css';

export default function Changelog() {

  return (
    <Container id='changeLog'>
        <ul>
          <li>V0.04 - 03/19/2020 - Removed Evergreen and added CSS sheets to beautify Robbie's badness.</li>
          <li>V0.03 - 03/17/2020 - Added per-hero damage. Low MMR is close to being revealed.</li>
          <li>V0.02 - 03/16/2020 - Added hero sprites. Robbie is still bad.</li>
          <li>V0.01 - 03/15/2020 - Enhanced data analysis. Results say Robbie low MMR.</li>
          <li>V0.00 - 03/14/2020 - Site begins. Someone is low MMR but we don't know who yet.</li>
        </ul>
    </Container>
  )
}