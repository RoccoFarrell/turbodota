import React from 'react';
import {
  Container
} from 'semantic-ui-react'
import './Changelog.css';

export default function Changelog() {

  return (
    <Container id='changeLog'>
        <ul>
          <li>V1.1 - 03/28/20 - Major release: Turbo Town is live. Play heroes and redeem quests!</li>
          <li>V1.0 - 03/23/2020 - After one week of coding and 3 years of planning, version 1.0 of Turbodota.com is live! We finally have a data-driven methodology for finding out why Robbie sucks at Spirit Breaker, in statistically significant detail.</li>
          <li>V0.05 - 03/19/2020 - Fixed routing, and displayed best players by MMR. Guess who's last, it might shock you...</li>
          <li>V0.04 - 03/19/2020 - Removed Evergreen and added CSS sheets to beautify Robbie's badness.</li>
          <li>V0.03 - 03/17/2020 - Added per-hero damage. Low MMR is close to being revealed.</li>
          <li>V0.02 - 03/16/2020 - Added hero sprites. Robbie is still bad.</li>
          <li>V0.01 - 03/15/2020 - Enhanced data analysis. Results say Robbie low MMR.</li>
          <li>V0.00 - 03/14/2020 - Site begins. Someone is low MMR but we don't know who yet.</li>
        </ul>
    </Container>
  )
}