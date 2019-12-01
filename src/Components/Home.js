
import React, { Component } from '../../node_modules/react';
import { Card, CardColumns, CardDeck} from '../../node_modules/react-bootstrap';

class Home extends Component {

    render () {
        const ComponentCard = (id) => {
            var items = [];
            for (let i = 0; i < 6; i++) {
                for (let j = 1; j < 6; j++) {
                    let lession = i * 5 + j;
                    items.push(<Card style={{ width: '24rem' }}>
                                <Card.Body>
                                    <Card.Title>Lesson {lession}</Card.Title>
                                    <Card.Text>
                                        Select one of the following session to start
                                    </Card.Text>
                                    <Card.Link href={`/synonymschoises/${lession}/1`}>Part 1</Card.Link>
                                    <Card.Link href={`/synonymschoises/${lession}/2`}>Part 2</Card.Link>
                                    <Card.Link href={`/synonymschoises/${lession}/3`}>Part 3</Card.Link>
                                    <Card.Link href={`/synonymschoises/${lession}/4`}>Part 4</Card.Link>
                                </Card.Body>
                            </Card>);
                }
            }

            return (
            <CardColumns >{items}</CardColumns>
            );
        }
        
        return (
            <ComponentCard id={1}/>
        );
    }
}

export default Home