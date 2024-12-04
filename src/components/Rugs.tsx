import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import pricingData from '../pricing-data.json';
import styles from '../styles/pricing.module.scss';
// import PriceBuilderModal from './_PriceBuilder';
import PriceBuilderModal from './_PriceBuilder3';
import InvoiceGeneratorModal from './InvoiceGenerator';

function Rugs() {

	// child data from the priceBuilder(since priceBuilder is the child of this component)
	const [childData, setChildData] = useState<any[]>();  // could create a type for this but dont have time...

	// Modal code for the 2 modals: PriceBuilder & InvoiceGenerator
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showModalInvoiceGen, setShowModalInvoiceGen] = useState<boolean>(false);
	const handleOpenModal = () => {
		setShowModal(true);
	};
	const handleCloseModal = () => {
		setShowModal(false);
	};
	const handleOpenModalInvoiceGen = () => {
		setShowModalInvoiceGen(true);
	};
	const handleCloseModalInvoiceGen = () => {
		setShowModalInvoiceGen(false);
	};

	// handle the data reciveved from PriceBuilderModal:
	const handleChildData = (data:any[]) =>{
		console.log(data)
		setChildData(data);
		setShowModalInvoiceGen(true);

	}

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
			{showModal && <PriceBuilderModal name={0} onDataRecieve={handleChildData} onClose={handleCloseModal} />}
			{showModalInvoiceGen && childData && <InvoiceGeneratorModal data={childData}  onClose={handleCloseModalInvoiceGen} />}
			
		</>
	);
}

export default Rugs;
