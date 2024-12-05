import React, { useState } from 'react';
import { Col, Card, Table, Button } from 'react-bootstrap';
import pricingData from '../pricing-data.json';
import PriceBuilderModal from './_PriceBuilder2';

function Mattresses() {
	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};
	return (
		<>
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

					<Card.Footer>
						<Button onClick={handleOpenModal}>Book now!</Button>
					</Card.Footer>
				</Card>
			</Col>

			{showModal && <PriceBuilderModal name={1} onClose={handleCloseModal} />}
		</>
	);
}

export default Mattresses;
