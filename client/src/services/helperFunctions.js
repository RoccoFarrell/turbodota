import React from 'react';

const heroIcon = (hero_id, heroObj) => {
    if(hero_id >= 136){
        console.log('finding marci')
    } else {
        let heroString = 'd2mh hero-' + hero_id
        return <i className={heroString}/>
    }
} 

export default {
    heroIcon: heroIcon
  }