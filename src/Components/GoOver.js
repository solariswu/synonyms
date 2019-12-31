import React, { Component } from 'react';
import { graphqlOperation } from "aws-amplify";
import { Connect } from "aws-amplify-react";
import { Auth } from 'aws-amplify';


import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations'
// import * as subscriptions from './graphql/subscriptions';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Button, Jumbotron, Form, Col, Row, Container, ButtonGroup, Fade } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { QUESTION_CONTENTS, QUESTION_TITLES } from '../consts/Const';
import { Pie } from 'react-chartjs-2';


function randomsort(a, b) {
    return Math.random()>.5 ? -1 : 1;
}

class GoOver extends Component {
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
            buttonText: 'Submit',
            username: '',
            sendHistory: null,
            updateSpacedRepetition: null
        };
      }

    handleOptionChange = changeEvent => {
        this.setState({
            selectedOption: changeEvent.target.value
        });
    }

    handleRedoSession = () => {
        this.state.results.fill(['-','-']);
        for (let index = 0; index < this.state.listItems.length; index ++) {
            this.shuffleItemAnswers (index);
        }
        this.setState({
            currentIndex: 0,
            selectedOption: '',
            answered: '',
            buttonText: 'Submit'
        });
    }

    // async 
    async addHistory (sendHistory, tryNum) {
        let currentItem = this.state.listItems[this.state.currentIndex];
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        let hh = today.getHours();
        let mi = today.getMinutes();
        let ss = today.getSeconds();

        today = yyyy + '-' + mm + '-' + dd;
        let now = hh + ':' + mi + ':' + ss + 'Z';

     
        const input = {
         //   id: this.state.username + yyyy + mm + dd + hh + mi + ss + this.state.session + this.state.part + tryNum,
            username: this.state.username,
            result: this.state.selectedOption === currentItem.Answer,
            tryNum: tryNum,
            answer: this.state.selectedOption,
            itemId: currentItem.id,
            sessionId: currentItem.session,
            partId: currentItem.type,
            index: currentItem.index,
            date: today,
            time: now,
            genre: 'goover'
        }
    
        try {
            // console.log (input);
            await sendHistory({input})
        } catch (err) {
            console.error(err);
        }
    }

    async updateSpacedRepetition (updateSpacedRepetition) {
        const stage = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 1087];
        const currentItem = this.state.listItems[this.state.currentIndex];
        const today = new Date();
        let nextRepeatDate = new Date(today);
        nextRepeatDate.setDate(nextRepeatDate.getDate() + stage[currentItem.stageIdx+1]);

        let dd = String(nextRepeatDate.getDate()).padStart(2, '0');
        let mm = String(nextRepeatDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = nextRepeatDate.getFullYear();

        const nextRepeatDateStr = yyyy + '-' + mm + '-' + dd;
     
        const input = {
            username: this.state.username,
            contentId: currentItem.id,
            date: nextRepeatDateStr,
            stageIdx: currentItem.stageIdx+1,
            times: currentItem.times + 1 
        }
    
        try {
            console.log ("SRS:", input);
            // await updateSpacedRepetition({input})
        } catch (err) {
            console.error(err);
        }
    } 

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
                this.setState({ buttonText: 'Next' });
                this.state.results[this.state.currentIndex][1] =
                    (this.state.selectedOption === currentItem.Answer);
                this.addHistory (this.state.sendHistory, 2);
            }
            // first try, update the resultBreadcum accordingly
            else {
                this.setState({ buttonText: 'Try Again' })
                this.state.results[this.state.currentIndex] =
                    [(this.state.selectedOption === currentItem.Answer), false];
                this.addHistory (this.state.sendHistory, 1);
                this.addToSpacedRepetition (this.state.addSpacedRepetition);
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
    }

    shuffleItemAnswers(index) {
        let currentItem = this.state.listItems[index];
        let choises = [currentItem.A, currentItem.B, currentItem.C, currentItem.D, currentItem.E];
        // random the choises list sequence
        choises.sort(randomsort);    
        this.state.listItems[index].A = choises[0];
        this.state.listItems[index].B = choises[1];
        this.state.listItems[index].C = choises[2];
        this.state.listItems[index].D = choises[3];
        this.state.listItems[index].E = choises[4];
    }
    
    componentDidMount() {
            const {session, part} = this.props.match.params;
            this.setState({session: session, part: part});

            Auth.currentAuthenticatedUser({
                bypassCache: false  
            }).then(user => {
                this.setState({username: user.username});
            });
    }

    render() {
        //console.log ('session:', this.state.session, ' part:', this.state.part);

        if (this.state.session === 0)
            return(<Container> Loading </Container>);

        const Hint = () => {

            if (this.state.listItems.length > 0) {
                let currentItem = this.state.listItems[this.state.currentIndex];

                if (this.state.answered.length > 0) {
                    let open = true;
                    if (this.state.answered !== currentItem.Answer) 
                        return (<Fade in={open}>
                            <div id='hint'> Not correct! <br/> {currentItem.Hint} <br /></div>
                        </Fade>);
                    else
                        return (<Fade in={open}>
                            <div id='hint'> Correct! <br /></div>
                        </Fade>);
                }
            }
            return (<Fade in={false}><div id='hint'></div></Fade>)
            // if (this.state.listItems.length > 0) {
            //     let currentItem = this.state.listItems[this.state.currentIndex];

            //     if (this.state.answered.length > 0) {
            //         if (this.state.answered !== currentItem.Answer) 
            //             return (<div> Not correct! <br/> {currentItem.Hint} <br /></div>)
            //         else 
            //             return (<div> Correct ! <br/> </div>)
            //     }
            // }
            // return (<div></div>)
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
            return (<div></div>);
        }

        const ResultBar = () => {
            return (
                <div className="bg-light" style={{display: "block"}}>
                <ButtonGroup>
                    { this.state.results.map ((result, index) => <Button
                                                                  variant={result[0] === '-' ?
                                                                           'secondary' :
                                                                           result[0] === true ?
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

        const ResultPie = () => {

            let data = {
                labels: [
                    'Correct',
                    '2ndTry',
                    'Wrong'
                ],
                datasets: [{
                    data: [0,0,0],
                    backgroundColor: [
                    '#36A2EB',
                    '#FFCE56',
                    '#FF6384'
                    ],
                    hoverBackgroundColor: [
                    '#36A2EB',
                    '#FFCE56',
                    '#FF6384'
                    ]
                }]
            };

            let firstTrue = 0;
            let secondTrue = 0;
            for (let i = 0; i < this.state.results.length; i++) {
              if (this.state.results[i][0] === true) 
                firstTrue ++;
              if (this.state.results[i][1] === true)
                secondTrue ++;
            }

            data.datasets[0].data[0] = firstTrue;
            data.datasets[0].data[1] = secondTrue;
            data.datasets[0].data[2] = this.state.results.length - firstTrue - secondTrue;

            return (
                <Container>
                    <h4 className="text-center">You've finished Session {this.state.session} Part {this.state.part}</h4>
                    <Pie data={data} />
                    <Row>
                        <Col></Col>
                        <Col>
                        <ul>
                        <li>Correct 1st: {firstTrue}</li>
                        <li>Correct 2nd: {secondTrue}</li>
                        <li>Wrong: {this.state.results.length - firstTrue - secondTrue}</li>
                        </ul>
                        </Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col className="col"></Col>
                        <Col className="col">
                        <Button onClick={this.handleRedoSession}>
                            Retry
                        </Button>
                        </Col>
                        <Col className="col"></Col>
                        <Col className="col">
                        <Button as={Link} to="/">
                            Back
                        </Button>
                        </Col>
                    </Row>
                </Container>
            );
        }

        const Question = () => {
            return (
                <Container>
                    <ResultBar />
                    {/* Brand Title */}
                    <div className="text-white bg-dark px-2">
                        Lesson {this.state.session} - {QUESTION_TITLES[this.state.part-1]}
                    </div>

                    <ListView />
                    {/* float button to right */}
                            <Row>
                             <Col>
                             <Hint />
                             </Col>
                             <Col>
                                <div style={{display: "flex"}}>
                                <Button 
                                    style={{ marginLeft: "auto" }} 
                                    id="submit" 
                                    onClick={() => this.handleSubmit()}> 
                                    { this.state.buttonText } 
                                </Button>
                                </div>
                            </Col>
                            </Row>
                </Container>
            );
        }

        // Data already retrieved, show questions or result summary
        if (this.state.listItems.length > 0) {
            if (this.state.currentIndex >= this.state.listItems.length) {
                return (<ResultPie />);
            }
            return (<Question />);
        }

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        // No data, retrieve it first. 
        return (
            <div>
                <Connect query={graphqlOperation(queries.listSynonymsSrs, 
                                    {"filter": { username: { eq: this.state.username},
                                                date: { eq: today}},
                                                limit: 15000})}>
                    {({ data: { listSynonymsSrs }, loading, errors }) => {
                    if (loading || !listSynonymsSrs) return (<h3>Loading...</h3>);
                        if (errors.lenth > 0 ) return (<h3>Error</h3>);

                        this.state.listItems = listSynonymsSrs.items;
                        
                        console.log ('result array: ', this.state.results);                   
        
                        return (<Question />);
                    }}
                </Connect>

                <Connect mutation={graphqlOperation(mutations.createPracticeHistory)}>
                  {({mutation}) => {
                      this.state.sendHistory = mutation;
                      return (<div></div>);
                  }}
                </Connect>

                <Connect mutation={graphqlOperation(mutations.updateSynonymsSrs)}>
                  {({mutation}) => {
                      this.state.updateSpacedRepetition = mutation;
                      return (<div></div>);
                      
                  }}
                </Connect>

            </div>
        );
    }
}

export default withRouter(GoOver);