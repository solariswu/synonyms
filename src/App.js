import React, { Component } from "react";
import Amplify from "aws-amplify";
import awsconfig from './appconfig';
import { HashRouter, Switch, Route } from "react-router-dom";

import SynonymsChoises from "./Components/SynonymsChoises";
import Home from "./Components/Home";

import { withAuthenticator } from "aws-amplify-react";

Amplify.configure(awsconfig);

class App extends Component {
    render () {
        Amplify.Logger.LOG_LEVEL = 'VERBOSE';

        return (
            <HashRouter basename='/'>
                <Switch>
                    {/* If the current URL is /about, this route is rendered
                        while the rest are ignored */}
                    <Route path="synonymschoises/:session/:part">}>
                        <SynonymsChoises />
                    </Route>

                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </HashRouter>
        );
    }
}

export default withAuthenticator(App);