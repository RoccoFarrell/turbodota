import React from 'react';
import {
  Container
} from 'semantic-ui-react'

export default function Changelog() {

  return (
    <Container fluid style={{ padding: '10em', margin: '10em'}}>
        <ul>
          <li>V0.02 - 03/16/2020 - Added hero sprites. Robbie is still bad</li>
          <li>V0.01 - 03/15/2020 - Enhanced data analysis. Results say Robbie low MMR</li>
          <li>V0.00 - 03/14/2020 - Site begins. Someone is low MMR but we don't know who yet</li>
        </ul>
    </Container>
  )
}