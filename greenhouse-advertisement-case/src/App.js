import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from 'jquery';
//import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import React from 'react';
import './App.css';
import AdvertiserComponent from './components/advertiser-component/advertiser-component'

function App() {
  
  return (
    <Router>
      <Route path="/" component={AdvertiserComponent}/>      
    </Router>);
}
export default App;
