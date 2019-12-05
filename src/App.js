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

        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/synonymschoises/:session/:part">}>
                        <SynonymsChoises />
                    </Route>

                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default withAuthenticator(App);