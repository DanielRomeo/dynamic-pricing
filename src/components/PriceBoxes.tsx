import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import styles from '../styles/priceBoxes.module.scss';
import PriceBuilderModal from './_PriceBuilder3';
import InvoiceGeneratorModal from './InvoiceGenerator';
import pricingArray from './pricingDataComponent';

function PriceBoxes() {
	// child data from the priceBuilder(since priceBuilder is the child of this component)
	const [childData, setChildData] = useState<any[]>(); // could create a type for this but dont have time...
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<any>(null);
	const [pricingData, setPricingData] = useState<any[]>([]);
	const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

	// Modal code for the 2 modals: PriceBuilder & InvoiceGenerator
	const [showModalInvoiceGen, setShowModalInvoiceGen] = useState<boolean>(false);
	const handleOpenModal = (index: number) => {
		setActiveModalIndex(index);
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
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h2 className={styles.title}>{element.name}</h2>
							</Card.Header>
							{/* We render a different card body depending on if the card has sizes or bedroom numbers */}

							<Card.Body className={styles.cardBody}>
								<Container>
									{element.sizes ? (
										<Row>
											<Col lg={7} md={7} sm={7}>
												<h6 className={styles.contentHeaders}>Sizes</h6>
											</Col>
											<Col lg={5} md={5} sm={5}>
												<h6 className={styles.contentHeaders}>Prices</h6>
											</Col>

											{element.sizes.map((size: string, i: number) => (
												<>
													<Col lg={7} md={7} sm={7}>
														<p className={styles.contentTexts}>
															{size}
														</p>
													</Col>
													<Col lg={5} md={5} sm={5}>
														<p className={styles.contentTexts}>
															R{element.prices[i]}
														</p>
													</Col>
												</>
											))}
										</Row>
									) : (
										<Row>
											<Col lg={7} md={7} sm={7}>
												<h6 className={styles.contentHeaders}>#Bedrooms</h6>
											</Col>
											<Col lg={5} md={5} sm={5}>
												<h6 className={styles.contentHeaders}>Prices</h6>
											</Col>
											{element.bedrooms?.map((bedroom: string, i: number) => (
												<>
													<Col lg={7} md={7} sm={7}>
														<p className={styles.contentTexts}>
															{bedroom}
														</p>
													</Col>
													<Col lg={5} md={5} sm={5}>
														<p className={styles.contentTexts}>
															R{element.prices[i]}
														</p>
													</Col>
												</>
											))}
										</Row>
									)}
								</Container>
							</Card.Body>

							<Card.Footer className={styles.cardFooter}>
								<Button
									className={styles.colorpickerButton}
									onClick={() => handleOpenModal(index)}
								>
									Book now!
								</Button>
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
					<InvoiceGeneratorModal data={childData} onClose={handleCloseModalInvoiceGen} />
				)}
			</Row>
		</div>
	);
}

export default PriceBoxes;
