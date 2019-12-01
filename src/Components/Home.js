
import React, { Component } from '../../node_modules/react';
import { Card, CardDeck} from '../../node_modules/react-bootstrap';

class Home extends Component {

    render () {
        const CardWall = (rows) => {
            let items = [];
            for (let i = 0; i< rows.rows; i++) {
                items.push (<CardRow rowId={i} key={i}/>);
            }
            return (<div>{items}</div>);
        }
        const CardRow = (rowId) => {
            let items = [];
            for (let j = 1; j < 5; j++) {
                let itemIdx = rowId.rowId * 4 + j;
                items.push(<Card style={{ width: '18rem' }} key={itemIdx}>
                            <Card.Body>
                                <Card.Title>Lesson {itemIdx}</Card.Title>
                                <Card.Text>
                                    Select one of the following session to start
                                </Card.Text>
                                <Card.Link href={`/synonymschoises/${itemIdx}/1`}>Part 1</Card.Link>
                                <Card.Link href={`/synonymschoises/${itemIdx}/2`}>Part 2</Card.Link>
                                <Card.Link href={`/synonymschoises/${itemIdx}/3`}>Part 3</Card.Link>
                                <br />
                                <Card.Link href={`/synonymschoises/${itemIdx}/4`}>Part 4</Card.Link>
                                <Card.Link href={`/synonymschoises/${itemIdx}/5`}>Part 5</Card.Link>
                            </Card.Body>
                        </Card>);
            }

            return (<CardDeck >{items}</CardDeck>);
        }
        
        return (
            <CardWall rows={7} />
        );
    }
}

export default Home