import React, { Component } from 'react';
import Amplify, { graphqlOperation }  from "aws-amplify";
import { withAuthenticator, Connect } from "aws-amplify-react";

import * as queries from './graphql/queries';
import awsconfig from './appconfig'
// import * as subscriptions from './graphql/subscriptions';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

Amplify.configure(awsconfig);

class App extends Component {

    render() {
        Amplify.Logger.LOG_LEVEL = 'VERBOSE';
        const ListView = ({ items }) => (
            <div>
                <h3>All Words</h3>
                <ToggleButtonGroup name='answers'>
                    <ToggleButton value={items[0].A}> {items[0].A} </ToggleButton>
                    <ToggleButton value={items[0].B}> {items[0].B} </ToggleButton>
                    <ToggleButton value={items[0].C}> {items[0].C} </ToggleButton>
                    <ToggleButton value={items[0].D}> {items[0].D} </ToggleButton>
                    <ToggleButton value={items[0].E}> {items[0].E} </ToggleButton>
                </ToggleButtonGroup>
            </div>
        );

        return (
            <Connect query={graphqlOperation(queries.listSynonyms)}>
                {({ data: { listSynonyms }, loading, errors }) => {
                    if (loading || !listSynonyms) return (<h3>Loading...</h3>);
                    if (errors.lenth > 0 ) return (<h3>Error</h3>);
                    return (<ListView items={listSynonyms.items} /> );
                }}
            </Connect>
        )
    }
} 

export default withAuthenticator(App);