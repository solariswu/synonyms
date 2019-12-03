import React, { Component } from 'react';
import { graphqlOperation } from "aws-amplify";
import { Connect } from "aws-amplify-react";

import * as queries from '../graphql/queries';
// import * as subscriptions from './graphql/subscriptions';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Button, Jumbotron, Form, Col, Row, Container, ButtonGroup } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { QUESTION_CONTENTS, QUESTION_TITLES } from '../consts/Const';

function randomsort(a, b) {
    return Math.random()>.5 ? -1 : 1;
}

class SynonymsChoises extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: 0,
            part: 0,
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
            this.setState({ currentIndex: this.state.currentIndex + 1 });
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
    
    componentDidMount() {
            const {session, part} = this.props.match.params;
            this.setState({session: session, part: part});
    }

    render() {
        //console.log ('session:', this.state.session, ' part:', this.state.part);

        if (this.state.session === 0)
            return(<Container> Loading </Container>);

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

        const ChoisesDisplay = () => {
            let currentItem = this.state.listItems[this.state.currentIndex];
            let choises = [currentItem.A, currentItem.B, currentItem.C, currentItem.D, currentItem.E];
            // random the choises list sequence
            // choises.sort(randomsort);

            return (
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
                                            key={choise}
                                            disabled={this.state.buttonText === 'Next'} />)}
                    </Col>
                    </Form.Group>
                </fieldset>
            );
        }

        const ListView = () => {
            let currentItem = this.state.listItems[this.state.currentIndex];
            if (this.state.listItems.length > 0) {
                return (
                    <Jumbotron>
                        <h5> {QUESTION_CONTENTS[this.state.part-1]} </h5>
                        <br />
                        <h3> {currentItem.base} </h3>
                        <br />
                        <ChoisesDisplay />
                    </Jumbotron>
                );
            }
            return (<div/>);
        }

        const ResultList = () => {
            return (
                <div className="bg-light" style={{display: "block"}}>
                <ButtonGroup>
                    { this.state.results.map ((result, index) => <Button
                                                                  variant={result === '-' ?
                                                                           'secondary' :
                                                                           result === true ?
                                                                           'success' : 'danger'}
                                                                  size="sm"
                                                                  key={index}
                                                                  className="mr-1"
                                                                  >
                                                                    {index+1}
                                                                  </Button>) }
                </ButtonGroup>
                </div>
            )
        }

        const PartResult = () => {

            return (
                <Container>
                    You've finished part {this.state.part} of session {this.state.session}.
                    Result is {this.state.results}.
                    <Button href="/">
                        Back
                    </Button>
                </Container>
            );
        }

        const Question = () => {
            return (
                <Container>
                    <ResultList />
                    {/* Brand Title */}
                    <div className="text-white bg-dark px-2">
                        Lession {this.state.session} - {QUESTION_TITLES[this.state.part-1]}
                    </div>

                    <ListView />

                    {/* float button to right */}
                    <div style={{display: "flex"}}>
                    <Button 
                        style={{ marginLeft: "auto" }} 
                        id="submit" 
                        onClick={this.handleSubmit}> 
                        { this.state.buttonText } 
                    </Button>
                    </div>
                    <Hint  />
                </Container>
            );
        }

        if (this.state.listItems.length > 0) {
            if (this.state.currentIndex >= this.state.listItems.length) {
                return (<PartResult />);
            }
            return (
                <Question /> 
            );
        }

        return (
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
                            if (this.state.results[index] !== true && 
                                this.state.results[index] !== false)
                                this.state.results[index] = ('-');
                        }
                        console.log ('result array: ', this.state.results);                   
        
                return (
                    <Question />
                );
            }}
            </Connect>
        )
    }
};

export default withRouter(SynonymsChoises);