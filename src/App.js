import React, { Component } from "react";
import Amplify from "aws-amplify";
import awsconfig from './appconfig';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import SynonymsChoises from "./Components/SynonymsChoises";
import Home from "./Components/Home";
import Trends from "./Components/Trends";
import Lessons from "./Components/Lessons";
import GoOver from "./Components/GoOver";
import Settings from "./Components/Settings";

import { withAuthenticator } from "aws-amplify-react";

Amplify.configure(awsconfig);

class App extends Component {
    render () {
        Amplify.Logger.LOG_LEVEL = 'VERBOSE';

        // console.log("Your process.env.PUBLIC_URL", process.env.PUBLIC_URL);

        return (
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Switch>
                    <Route exact path="/synonymschoises/:session/:part" component={SynonymsChoises} />
                    <Route path="/Lessons" component={Lessons} />
                    <Route path="/trends" component={Trends} />
                    <Route path="/goover" component={GoOver} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/" component={Home} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default withAuthenticator(App);