import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import pricingData from '../pricing-data.json';
import styles from '../styles/pricing.module.scss';
// import PriceBuilderModal from './_PriceBuilder';
import PriceBuilderModal from './_PriceBuilder2';

function Rugs() {
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
				<Card className={styles['pricing-card']}>
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
					<Card.Footer>
						<Button onClick={handleOpenModal}>Book now!</Button>
					</Card.Footer>
				</Card>
			</Col>

			{/* Render the PriceBuilderModal when the state is true */}
			{showModal && <PriceBuilderModal name={'Rugs'} onClose={handleCloseModal} />}
		</>
	);
}

export default Rugs;
