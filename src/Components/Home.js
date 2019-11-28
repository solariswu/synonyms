
import React, { Component } from '../../node_modules/react';
import { Card } from '../../node_modules/react-bootstrap';



class Home extends Component {

    render () {
        const ComponentCards = () => {
            return (
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>Lesson 1</Card.Title>
                        <Card.Text>
                            Select one of the following session to start
                        </Card.Text>
                        <Card.Link href="/synonymschoises/:1">Part 1</Card.Link>
                        <Card.Link href="/synonymschoises/:1">Part 2</Card.Link>
                        <Card.Link href="/synonymschoises/:1">Part 3</Card.Link>
                        <Card.Link href="/synonymschoises/:1">Part 4</Card.Link>
                    </Card.Body>
                </Card>
            );
        }
        
        return (
            <ComponentCards />
        );
    }
}

export default Home