import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import * as serviceWorker from './serviceWorker';

//Import Layout
import UserLayout from "./layouts/userLayout";
import CampaignLayout from "./layouts/campaignLayout";
//Bootstrap Css
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/user" render={props => <UserLayout {...props} />} />
      <Route path="/campaigns" render={props => <CampaignLayout {...props} />} />
      <Redirect from="/" to="/user" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
