import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Container, Row, Col } from 'react-bootstrap';


function App() {
  return (
    <div className="App">
      <Container>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Button variant="primary">Bootstrap Button</Button>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default App;
