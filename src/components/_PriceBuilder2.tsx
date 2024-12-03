import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Accordion, FormCheck } from 'react-bootstrap';
import pricingArray from './pricingDataComponent';

interface PriceBuilderModalProps {
	onClose: () => void;
	name: number;
}

interface PricingItem {
	name: string;
	sizes: string[];
	prices: (number | string)[];
}

const PriceBuilderModal: React.FC<PriceBuilderModalProps> = ({ onClose, name }) => {
	// state:
	const [pricingData, setPricingData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<any>(null);
	const [selectedItems, setSelectedItems] = useState<{[key: string]: string[]}>({});
	const [totalPrice, setTotalPrice] = useState(0);

	// pagination and form data state:
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		billToAddress: '',
		additionalNotes: '',
		paymentTerms: ''
	});

	// useEffect to fetch data:
	useEffect(() => {
		const fetchPricingData = async () => {
			setIsLoading(true);
			try {
				setPricingData(pricingArray);
				setIsLoading(false);
				console.log("Pricing data loaded", pricingData);
			} catch (err) {
				setError(err);
				setIsLoading(false);
			}
		};
		fetchPricingData();
	}, []);

	// Calculate total price whenever selected items change
	useEffect(() => {
		let total = 0;
		pricingData.forEach(element => {
			const categoryName = element.name;
			const selectedSizes = selectedItems[categoryName] || [];
			
			selectedSizes.forEach(selectedSize => {
				const index = element.sizes 
					? element.sizes.indexOf(selectedSize) 
					: element.bedrooms.indexOf(selectedSize);
				
				if (index !== -1) {
					const price = typeof element.prices[index] === 'string'
						? parseFloat(element.prices[index])
						: element.prices[index];
					total += price;
				}
			});
		});

		setTotalPrice(total);
	}, [selectedItems, pricingData]);

	// handle checkbox state:
	const handleItemSelect = (categoryName: string, size: string) => {
		setSelectedItems(prev => {
			const currentCategoryItems = prev[categoryName] || [];
			const updatedCategoryItems = currentCategoryItems.includes(size)
				? currentCategoryItems.filter(item => item !== size)
				: [...currentCategoryItems, size];

			return {
				...prev,
				[categoryName]: updatedCategoryItems
			};
		});
	};

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		console.log('Selected items:', selectedItems);
		console.log('Form data:', formData);
		setCurrentStep(2);
	};

	// Handle going back to previous step
	const handlePrevStep = () => {
		setCurrentStep(1);
	};

	return (
		<Modal show={true} className="modal-xl" onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Price Builder</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{/* Total Price Display */}
				<div className="alert alert-info text-center mb-3">
					<strong>Total Price: ${totalPrice.toFixed(2)}</strong>
				</div>

				{currentStep === 1 && (
					<>	
						<p>Page 1/2</p>
						<h4>Select items: </h4>
						<Accordion defaultActiveKey={[String(name)]} alwaysOpen  flush>
							{pricingData?.length > 0 && !isLoading ? (
								<div>
									{pricingData.map((element, index) => (
										<Accordion.Item key={index} eventKey={String(index)}>
											<Accordion.Header>{element.name}</Accordion.Header>
											<Accordion.Body>
												{element.sizes ? (
													element.sizes.map((size:string, i:number) => (
														<FormCheck 
															key={i}
															type="checkbox"
															id={`${element.name}-${size}`}
															label={`${size}: R${element.prices[i]}`}
															checked={(selectedItems[element.name] || []).includes(size)}
															onChange={() => handleItemSelect(element.name, size)}
														/>
													))
												) : (
													element.bedrooms?.map((bedroom:string, i:number) => (
														<FormCheck 
															key={i}
															type="checkbox"
															id={`${element.name}-${bedroom}`}
															label={`${bedroom} Bedrooms: R${element.prices[i]}`}
															checked={(selectedItems[element.name] || []).includes(bedroom)}
															onChange={() => handleItemSelect(element.name, bedroom)}
														/>
													))
												)}
											</Accordion.Body>
										</Accordion.Item>
									))}
								</div>
							) : (
								'...loading'
							)}
						</Accordion>

						<br/>

						<Button onClick={handleSubmit}>Next!</Button>
					</>
				)}

				{currentStep === 2 && (
					<>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="formName">
							<Form.Label>Full name</Form.Label>
							<Form.Control
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								required
							/>
						</Form.Group>
						<Form.Group controlId="formEmail">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								required
							/>
						</Form.Group>
						<Form.Group controlId="formPhone">
							<Form.Label>Cell phone number</Form.Label>
							<Form.Control
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleInputChange}
								required
							/>
						</Form.Group>

						<Form.Group controlId="formBillToAddress">
							<Form.Label>Bill to, Address</Form.Label>
							<Form.Control
								type="textarea"
								name="billToAddress"
								value={formData.billToAddress}
								onChange={handleInputChange}
								required
							/>
						</Form.Group>

						{/* Addtional notes */}
						<Form.Group controlId="formAdditionalNotes">
							<Form.Label>Additional Notes</Form.Label>
							<Form.Control
								type="textarea"
								name="additionalNotes"
								value={formData.additionalNotes}
								onChange={handleInputChange}
								required
							/>
						</Form.Group>

						{/* Payment terms */}
						<Form.Group controlId="formPaymentTerms">
							<Form.Label>Payment Terms</Form.Label>
							<Form.Control
								type="textarea"
								name="paymentTerms"
								value={formData.paymentTerms}
								onChange={handleInputChange}
								required
							/>
						</Form.Group>

						



						<div className="text-right">
							<br/>
							<Button onClick={handlePrevStep}>Prev</Button>
							<Button variant="secondary" onClick={onClose}>
								Cancel
							</Button>
							<Button variant="primary" type="submit">
								Book Now
							</Button>
						</div>
					</Form>
					
					</>
				)}
			</Modal.Body>
		</Modal>
	);
};

export default PriceBuilderModal;