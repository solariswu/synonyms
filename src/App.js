import React, { Component } from 'react';
import Amplify, { graphqlOperation }  from "aws-amplify";
import { withAuthenticator, Connect } from "aws-amplify-react";

import * as queries from './graphql/queries';
import awsconfig from './appconfig'
// import * as subscriptions from './graphql/subscriptions';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Jumbotron, Form, Col, Row, Container, ButtonGroup } from 'react-bootstrap';

Amplify.configure(awsconfig);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listItems: [],
            results: [],
            currentIndex: 0,
            selectedOption: '',
            answered: '',
            buttonText: 'Submit'
        };
      }

    handleOptionChange = changeEvent => {
        this.setState({
            selectedOption: changeEvent.target.value
        });
    };

    handleSubmit = () => {
        let currentItem = this.state.listItems[this.state.currentIndex];

        if (this.state.buttonText === 'Next') {
            // clear state
            this.setState({
                answered: '',
                selectedOption: '',
                buttonText: 'Submit'
            });
            // move to next item
            this.state.currentIndex ++;
        }
        // the user made choise / selected one of the radio input
        else if (this.state.selectedOption.length > 0 &&
            this.state.answered !== this.state.selectedOption) {
            // second try, change button text
            if (this.state.answered !== '') {
                this.setState({ buttonText: 'Next' })
            }
            // first try, update the resultBreadcum accordingly
            else {
                this.setState({ buttonText: 'Try Again' })
                this.state.results[this.state.currentIndex] =
                    (this.state.selectedOption === currentItem.Answer);
            }
            // update answered reccord
            this.setState({
                answered: this.state.selectedOption
            });
            // correct answer, change the button to 'Next'
            if (this.state.selectedOption === currentItem.Answer) {
                this.setState({ buttonText: 'Next' })
            }
        }
        //console.log("You have submitted:", this.state.selectedOption);
    };

    render() {
       Amplify.Logger.LOG_LEVEL = 'VERBOSE';
        const Hint = () => {
            if (this.state.listItems.length > 0) {
                let currentItem = this.state.listItems[this.state.currentIndex];

                if (this.state.answered.length > 0) {
                    if (this.state.answered !== currentItem.Answer) 
                        return (<div> Not correct! <br/> {currentItem.Hint} <br /></div>)
                    else 
                        return (<div> Correct ! <br/> </div>)
                }
            }
            return (<div> <br /> <br /> </div>)
        } 

        const ListView = () => {
            if (this.state.listItems.length > 0) {
                let currentItem = this.state.listItems[this.state.currentIndex];
                let choises = [currentItem.A, currentItem.B, currentItem.C, currentItem.D, currentItem.E];

                return (
                    <Jumbotron>
                        <h4>Please select the most <strong>similar</strong> word to the following word </h4>
                        <br />
                        <h3> {currentItem.base} </h3>
                        <br />
                        <fieldset>
                            <Form.Group as={Row}>
                            <Col sm={10}>
                            { choises.map (choise => <Form.Check 
                                                    type="radio"
                                                    label={choise}
                                                    name="answer"
                                                    id={choise} 
                                                    value={choise}
                                                    onChange={this.handleOptionChange}
                                                    checked={this.state.selectedOption === choise}
                                                    key={choise} />)}
                            </Col>
                            </Form.Group>
                        </fieldset>
                    </Jumbotron>
                );
            }
            return (<div/>);
        }

        const ResultList = () => {
            return (
                <ButtonGroup>
                    { this.state.results.map ((result, index) => <Button
                                                                  variant={result === '-' ?
                                                                           'secondary' :
                                                                           result === true ?
                                                                           'success' : 'danger'}
                                                                  size="sm"
                                                                  key={index}
                                                                  >
                                                                    {index+1}
                                                                  </Button>) }
                </ButtonGroup>
            )
        }

        return (
                <Connect query={graphqlOperation(queries.listSynonyms)}>
                    {({ data: { listSynonyms }, loading, errors }) => {
                    if (loading || !listSynonyms) return (<h3>Loading...</h3>);
                        if (errors.lenth > 0 ) return (<h3>Error</h3>);

                        this.state.listItems = listSynonyms.items;
                        const itemsLen = listSynonyms.items.length;
                        for (let index = 0; index < itemsLen; index ++) {
                            if (this.state.results[index] !== true && 
                                this.state.results[index] !== false)
                                this.state.results[index] = ('-');
                        }
                        console.log ('result array: ', this.state.results);                   
        
                return (
                    <Container>
                        <ResultList />
                        {/* Brand Title */}
                        <div style={{backgroundColor: "black"}}>Synonyms</div>

                        <ListView />
                        <Hint  />

                        {/* float button to right */}
                        <div style={{display: "flex"}}>
                        <Button 
                            style={{ marginLeft: "auto" }} 
                            id="submit" 
                            onClick={this.handleSubmit}> 
                            { this.state.buttonText } 
                        </Button>
                        </div>
                    </Container>
                );
            }}
            </Connect>
        )
    }
} 

export default withAuthenticator(App);