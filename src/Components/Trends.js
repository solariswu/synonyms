import React, { Component } from 'react';
import { graphqlOperation } from "aws-amplify";
import { Connect } from "aws-amplify-react";
import { Pie } from 'react-chartjs-2';


class Trends extends Component {

    render () {
        return (
            <session>
                <Connect query={graphqlOperation(queries.listSynonyms, 
                                    {"filter": { session: { eq: this.state.session},
                                                type: { eq: this.state.part.toString()}},
                                                limit: 5000})}>
                    {({ data: { listSynonyms }, loading, errors }) => {
                    if (loading || !listSynonyms) return (<h3>Loading...</h3>);
                        if (errors.lenth > 0 ) return (<h3>Error</h3>);

                        this.state.listItems = listSynonyms.items;
                        const itemsLen = listSynonyms.items.length;
                        for (let index = 0; index < itemsLen; index ++) {
                            // initiate result.
                            this.state.results[index] = ['-', '-'];

                            this.shuffleItemAnswers (index);
                        }
                        console.log ('result array: ', this.state.results);                   
        
                        return (<Question />);
                    }}
                </Connect>
            </session>
        );
    }
}