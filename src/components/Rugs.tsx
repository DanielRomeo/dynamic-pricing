import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import pricingData from '../pricing-data.json';
import styles from '../styles/pricing.module.scss';
// import PriceBuilderModal from './_PriceBuilder';
import PriceBuilderModal from './_PriceBuilder3';
import InvoiceGeneratorModal from './InvoiceGenerator';

import pricingArray from './pricingDataComponent';

function Rugs() {
	// child data from the priceBuilder(since priceBuilder is the child of this component)
	const [childData, setChildData] = useState<any[]>(); // could create a type for this but dont have time...
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<any>(null);
	const [pricingData, setPricingData] = useState<any[]>([]);
    const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);


	// Modal code for the 2 modals: PriceBuilder & InvoiceGenerator
	const [showModalInvoiceGen, setShowModalInvoiceGen] = useState<boolean>(false);
	const handleOpenModal = (index: number) => {
		setActiveModalIndex(index)
	};
	const handleCloseModal = () => {
		setActiveModalIndex(null);
	};
	const handleOpenModalInvoiceGen = () => {
		setShowModalInvoiceGen(true);
	};
	const handleCloseModalInvoiceGen = () => {
		setShowModalInvoiceGen(false);
	};

	// handle the data reciveved from PriceBuilderModal:
	const handleChildData = (data: any[]) => {
		// console.log(data);
		setChildData(data);
		setShowModalInvoiceGen(true);
	};

	// useEffect to fetch data:
	useEffect(() => {
		const fetchPricingData = async () => {
			setIsLoading(true);
			try {
				setPricingData(pricingArray);
				setIsLoading(false);
				// console.log("Pricing data loaded", pricingData);
			} catch (err) {
				setError(err);
				setIsLoading(false);
			}
		};
		fetchPricingData();
	}, []);

	return (

		<div>
			<Row>
				{pricingData.map((element, index: number) => (
					
						<Col md={4} lg={4} sm={12}>
							<Card className={styles['pricing-card']}>
								<Card.Header>{element.name}</Card.Header>
								{/* We render a different card body depending on if the card has sizes or bedroom numbers */}
								
								<Card.Body>
									<Container>
										{element.sizes ? (
											<Row>
												<Col md={6}>Sizes</Col>
												<Col md={6}>Prices</Col>
												{element.sizes.map((size: string, i: number) => (
													<Row>
														<Col md={6}>{size}</Col>
														<Col md={6}>{element.prices[i]}</Col>
													</Row>
												))}
											</Row>
										) : (
											<Row>
												<Col md={6}>Bedrooms</Col>
												<Col md={6}>Prices</Col>
												{element.bedrooms?.map((bedroom: string, i: number) => (
													<Row>
														<Col md={6}>{bedroom}</Col>
														<Col md={6}>{element.prices[i]}</Col>
												</Row>
												))}
											</Row>
										)}
									</Container>
								</Card.Body>

								<Card.Footer>
									<Button onClick={()=> handleOpenModal(index)}>Book now!</Button>
								</Card.Footer>
							</Card>

							{activeModalIndex === index && (
								<PriceBuilderModal
									categoryId={index.toString()}
									onDataRecieve={handleChildData}
									onClose={handleCloseModal}
								/>
							)}
					</Col>
				))}
						
			</Row>

			<Row>
				
				{showModalInvoiceGen && childData && (
					<InvoiceGeneratorModal
						data={childData}
						onClose={handleCloseModalInvoiceGen}
					/>
				)}
			</Row>
		</div>
	);
}

export default Rugs;
