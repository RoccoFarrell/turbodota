import React, { useState, useEffect, useContext } from 'react';
import { Pane, Text, Heading, SearchInput, ThemeProvider, defaultTheme, majorScale } from 'evergreen-ui'
import { useHistory } from "react-router-dom";
import axios from 'axios'
import TurbodotaContext from './TurbodotaContext'

function SingleMatch(props) {
    const match=props.matchData

    function winOrLossColor (slot, win) {
        if (slot > 127){
            if (win === false){
                return('lightGreen')
            }
            else return('salmon')
        }
        else {
            if (win === false){
                return('salmon')
            }
            else return('lightGreen')
        }
    }

    return (
        <Pane
            width='90%'
            margin={majorScale(1)}
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            background={winOrLossColor(match.player_slot, match.radiant_win)}
        >
            <Pane>{match.match_id}</Pane>
            <Pane>{match.hero_id}</Pane>
            <Pane>{match.duration}</Pane>
            <Pane>{match.kills}</Pane>
            <Pane>{match.deaths}</Pane>
            <Pane>{match.assists}</Pane>
        </Pane>
    )
}

export default SingleMatch;
