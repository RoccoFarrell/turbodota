import React from 'react';
import {
  Container,
  Feed,
  Icon
} from 'semantic-ui-react'
import './Changelog.css';

const changeLogArray = [
  { 'version': 'V1.21 ', 'date': '04/27/2021', 'description': 'We are real devs, our pull request was accepted by Bontscho. Updated icons for Hoodwink and Dawnbreaker'},
  { 'version': 'V1.20 ', 'date': '04/21/2021', 'description': 'Major release, new quest UI and Obs Wards from the shop'},
  { 'version': 'V1.12 ', 'date': '04/07/2021', 'description': 'Town redesign, XP and Leveling system live.... Robbie Low Levels'},
  { 'version': 'V1.11 ', 'date': '04/02/2021', 'description': 'Trying to fix townController again, some things never change'},
  { 'version': 'V1.10 ', 'date': '04/01/2021', 'description': 'April Fools - Jokes on us - broke website 1 year after launch'},
  { 'version': 'V1.02 ', 'date': '03/29/2020', 'description': 'Ben\'s first feature: wins and losses on last 10'},
  { 'version': 'V1.01 ', 'date': '03/28/2020', 'description': 'Major release: Turbo Town is live. Play heroes and redeem quests!'},
  { 'version': 'V1.00 ', 'date': '03/23/2020', 'description': 'After one week of coding and 3 years of planning, version 1.0 of Turbodota.com is live! We finally have a data-driven methodology for finding out why Robbie sucks at Spirit Breaker, in statistically significant detail.'},
  { 'version': 'V0.05 ', 'date': '03/19/2020', 'description': 'Fixed routing, and displayed best players by MMR. Guess who\'s last, it might shock you...'},
  { 'version': 'V0.04 ', 'date': '03/19/2020', 'description': 'Removed Evergreen and added CSS sheets to beautify Robbie\'s badness.'},
  { 'version': 'V0.03 ', 'date': '03/17/2020', 'description': 'Added per-hero damage. Low MMR is close to being revealed.'},
  { 'version': 'V0.02 ', 'date': '03/16/2020', 'description': 'Added hero sprites. Robbie is still bad.'},
  { 'version': 'V0.01 ', 'date': '03/15/2020', 'description': 'Enhanced data analysis. Results say Robbie low MMR.'},
  { 'version': 'V0.00 ', 'date': '03/14/2020', 'description': 'Site begins. Someone is low MMR but we don\'t know who yet.'}
]

export default function Changelog() {
  return (
  <Container id='changeLog'>
      <Feed>
        { changeLogArray.map((log,index) => (
          <Feed.Event key={index}>
            <Feed.Label>
              <Icon fitted name='sticky note outline' />
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary>
                <div>{log.version + ' - ' + log.description} </div>
                <Feed.Date>{log.date} </Feed.Date>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        ))}
      </Feed>
    </Container>
  )
}