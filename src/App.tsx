import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import pricingData from './pricing-data.json';
import styles from './styles/pricing.module.scss'

function App() {
  return (
    <Container className={styles.pricingpage}>
      <h1 className="text-center my-5">Check out our prices</h1>

      <Row className="mb-5">
        <Col md={4}>
          <Card className="pricing-card">
            <Card.Header>Rugs</Card.Header>
            <Card.Body>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Sizes</th>
                    <th>Prices</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingData.rugs.sizes.map((size, index) => (
                    <tr key={index}>
                      <td>{size}</td>
                      <td>R {pricingData.rugs.prices[index].toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Repeat similar structure for other pricing sections */}

      </Row>
    </Container>
  );
}

export default App;
