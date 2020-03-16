import React from 'react';

import {
  BrowserRouter as Router,
} from "react-router-dom";
import Layout from './components/Layout'
import TurbodotaProvider from './components/TurbodotaProvider'

import logo from './assets/squareLogo.png';

export default function App() {
  return (
    <TurbodotaProvider>
      <Router>
        <Layout/>
      </Router>
    </TurbodotaProvider>
  )
}