import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import pricingData from '../pricing-data.json';
import styles from '../styles/pricing.module.scss';

function Mattresses() {
	return (
		<Col md={4}>
			<Card className="pricing-card">
				<Card.Header>Mattresses</Card.Header>
				<Card.Body>
					<Table striped bordered>
						<thead>
							<tr>
								<th>Sizes</th>
								<th>Prices</th>
							</tr>
						</thead>
						<tbody>
							{pricingData.mattresses.sizes.map((size, index) => (
								<tr key={index}>
									<td>{size}</td>
									<td>R {pricingData.mattresses.prices[index].toFixed(2)}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Card.Body>
			</Card>
		</Col>
	);
}

export default Mattresses;
