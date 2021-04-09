import React from 'react';
import {
  Container,
  Feed
} from 'semantic-ui-react'
import './Changelog.css';

export default function Changelog() {

  return (
/*     <Container id='changeLog'>
        <ul>
          <li>V1.3 - 04/07/21 - Town redesign, XP and Leveling system live.... Robbie Low Levels</li>
          <li>V1.2 - 04/02/21 - Trying to fix townController again, some things never change</li>
          <li>V1.1.99 - 04/01/21 - April Fools - Jokes on us - broke website 1 year after launch</li>
          <li>V1.1.01 - 03/29/20 -Ben's first feature: wins and losses on last 10</li>
          <li>V1.1 - 03/28/20 - Major release: Turbo Town is live. Play heroes and redeem quests!</li>
          <li>V1.0 - 03/23/2020 - After one week of coding and 3 years of planning, version 1.0 of Turbodota.com is live! We finally have a data-driven methodology for finding out why Robbie sucks at Spirit Breaker, in statistically significant detail.</li>
          <li>V0.05 - 03/19/2020 - Fixed routing, and displayed best players by MMR. Guess who's last, it might shock you...</li>
          <li>V0.04 - 03/19/2020 - Removed Evergreen and added CSS sheets to beautify Robbie's badness.</li>
          <li>V0.03 - 03/17/2020 - Added per-hero damage. Low MMR is close to being revealed.</li>
          <li>V0.02 - 03/16/2020 - Added hero sprites. Robbie is still bad.</li>
          <li>V0.01 - 03/15/2020 - Enhanced data analysis. Results say Robbie low MMR.</li>
          <li>V0.00 - 03/14/2020 - Site begins. Someone is low MMR but we don't know who yet.</li>
        </ul>
    </Container> */
  <Container id='changeLog'>
      <Feed>
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>V1.3</Feed.User> Town redesign, XP and Leveling system live.... Robbie Low Levels
              <Feed.Date>04/07/21</Feed.Date>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>V1.2</Feed.User> Trying to fix townController again, some things never change
              <Feed.Date>04/02/21</Feed.Date>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>V1.1.99</Feed.User> April Fools - Jokes on us - broke website 1 year after launch
              <Feed.Date>04/01/21</Feed.Date>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>V1.1.01</Feed.User> Ben's first feature: wins and losses on last 10
              <Feed.Date>03/29/20</Feed.Date>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>V1.1</Feed.User> Major release: Turbo Town is live. Play heroes and redeem quests!
              <Feed.Date>03/28/20</Feed.Date>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>V1.0</Feed.User> After one week of coding and 3 years of planning, version 1.0 of Turbodota.com is live! We finally have a data-driven methodology for finding out why Robbie sucks at Spirit Breaker, in statistically significant detail.
              <Feed.Date>03/23/20</Feed.Date>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>V0.05</Feed.User> Fixed routing, and displayed best players by MMR. Guess who's last, it might shock you...
              <Feed.Date>03/19/20</Feed.Date>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>V0.04</Feed.User> Removed Evergreen and added CSS sheets to beautify Robbie's badness.
              <Feed.Date>03/19/20</Feed.Date>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>V0.03</Feed.User> Added per-hero damage. Low MMR is close to being revealed.
              <Feed.Date>03/17/20</Feed.Date>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>V0.02</Feed.User> Enhanced data analysis. Results say Robbie low MMR.
              <Feed.Date>03/15/20</Feed.Date>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>V0.01</Feed.User> Site begins. Someone is low MMR but we don't know who yet.
              <Feed.Date>03/14/20</Feed.Date>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
      </Feed>
    </Container>
  )
}