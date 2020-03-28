import React from 'react';

import {
  BrowserRouter as Router,
} from "react-router-dom";
import Layout from './components/Layout'
import TurbodotaProvider from './components/TurbodotaProvider'

import 'dota2-minimap-hero-sprites/assets/stylesheets/dota2minimapheroes.css';

export default function App() {
  return (
    <TurbodotaProvider>
      <Router>
        <Layout/>
      </Router>
    </TurbodotaProvider>
  )
}