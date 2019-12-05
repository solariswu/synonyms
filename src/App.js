import React, { Component } from "react";
import Amplify from "aws-amplify";
import awsconfig from './appconfig';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import SynonymsChoises from "./Components/SynonymsChoises";
import Home from "./Components/Home";

import { withAuthenticator } from "aws-amplify-react";

Amplify.configure(awsconfig);

class App extends Component {
    render () {
        Amplify.Logger.LOG_LEVEL = 'VERBOSE';

        console.log("Your process.env.PUBLIC_URL", process.env.PUBLIC_URL);

        return (
            <BrowserRouter basename='synonyms'>
                <Switch>
                    <Route exact path="/synonymschoises/:session/:part" component={SynonymsChoises} />
                    <Route path="/" component={Home} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default withAuthenticator(App);