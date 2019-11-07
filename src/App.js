import React, { Component } from 'react';
import Amplify, { graphqlOperation }  from "aws-amplify";
import { withAuthenticator, Connect } from "aws-amplify-react";

import * as queries from './graphql/queries';
import awsconfig from './appconfig'
// import * as subscriptions from './graphql/subscriptions';

Amplify.configure(awsconfig);

class App extends Component {

    render() {
        // Amplify.Logger.LOG_LEVEL = 'VERBOSE';
        const ListView = ({ items }) => (
            <div>
                <h3>All Words</h3>
                <ul>
                    {items.map(item => <li key={item.id}>{item.name} ({item.id})</li>)}
                </ul>
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