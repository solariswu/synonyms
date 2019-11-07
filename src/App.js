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
    constructor(props) {
        super(props);
        this.state = {answer: ''};
      }

    handleAnswer = (answer) => {
        this.setState({
            answer: answer
          });
    }

    render() {
        Amplify.Logger.LOG_LEVEL = 'VERBOSE';

        const Hint = ({ content, correctAnswer } ) => {
            if (this.state.answer.length > 0)  
                if (this.state.answer !== correctAnswer)  
                    return ( <div> Nope! <br/> {content} </div> )
                else 
                    return (<div> Correct ! </div>)
            
            return (<div/>)
        } 

        const ListView = ({ items }) => (
            <div>
                <h3>Please select the most <strong>similar</strong> word to the following word </h3>
                <h3> ({items[0].base}) </h3>
                <ToggleButtonGroup name='answers'>
                    <ToggleButton value={items[0].A} onChange={() => this.handleAnswer(items[0].A)}> {items[0].A} </ToggleButton>
                    <ToggleButton value={items[0].B} onChange={() => this.handleAnswer(items[0].B)}> {items[0].B} </ToggleButton>
                    <ToggleButton value={items[0].C} onChange={() => this.handleAnswer(items[0].C)}> {items[0].C} </ToggleButton>
                    <ToggleButton value={items[0].D} onChange={() => this.handleAnswer(items[0].D)}> {items[0].D} </ToggleButton>
                    <ToggleButton value={items[0].E} onChange={() => this.handleAnswer(items[0].E)}> {items[0].E} </ToggleButton>
                </ToggleButtonGroup>
            </div>
        );

        return (
            <Connect query={graphqlOperation(queries.listSynonyms)}>
                {({ data: { listSynonyms }, loading, errors }) => {
                    if (loading || !listSynonyms) return (<h3>Loading...</h3>);
                    if (errors.lenth > 0 ) return (<h3>Error</h3>);
                    return (
                        <div>
                            <ListView items={listSynonyms.items} /> 
                            <Hint content={listSynonyms.items[0].Hint}
                                  correctAnswer={listSynonyms.items[0].Answer} />
                        </div>
                    );
                }}
            </Connect>
        )
    }
} 

export default withAuthenticator(App);