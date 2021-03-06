
import React, { Component } from '../../node_modules/react';
import { Container, Row, Col, Card } from '../../node_modules/react-bootstrap';
import { Link } from 'react-router-dom';

class Home extends Component {

    render () {
        
        return (
          <Container>
              <Row>
                <Col>
                    <Card className="mt-1" style={{ width: '18rem' }} key='goover'>
                        <Card.Body>
                           <Card.Link as={Link} to={`/goover`}>Go Over</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="mt-1" style={{ width: '18rem' }} key='lessons'>
                        <Card.Body>
                           <Card.Link as={Link} to={`/lessons`}>Lessons</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
              </Row>
              <Row>
                  <Col>
                  <Card className="mt-1" style={{ width: '18rem' }} key='trends'>
                        <Card.Body>
                           <Card.Link as={Link} to={`/trends`}>History</Card.Link>
                        </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                  <Card className="mt-1" style={{ width: '18rem' }} key='setting'>
                        <Card.Body>
                           <Card.Link as={Link} to={`/settings`}>Settings</Card.Link>
                        </Card.Body>
                    </Card>
                 </Col>
              </Row>
          </Container>
        );
    }
}

export default Home