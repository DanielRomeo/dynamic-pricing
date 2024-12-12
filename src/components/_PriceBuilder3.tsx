import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import pricingArray from './pricingDataComponent';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Accordion, FormCheck } from 'react-bootstrap';
import InvoiceGeneratorModal from './InvoiceGenerator';
import styles from '../styles/priceBuilder.module.scss'
import '../styles/priceBuilderModal.css'

interface PriceBuilderModalProps {
	onClose: () => void;
	onDataRecieve: (data: any[]) => void; // this takes an array of objects bro
	categoryId: string;
}

interface PricingItem {
	name: string;
	sizes: string[];
	prices: (number | string)[];
}

type FormData = {
	name: string;
	email: string;
	phone: string;
	billToAddress: string;
	additionalNotes?: string;
	paymentTerms: 'EFT' | 'Cash';
};

const validationSchema = yup.object({
	name: yup
		.string()
		.required('Full name is required')
		.min(2, 'Name must be at least 2 characters'),
	email: yup.string().required('Email is required').email('Invalid email address'),
	phone: yup
		.string()
		.required('Phone number is required')
		.matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
	billToAddress: yup.string().required('Billing address is required'),
	additionalNotes: yup.string().optional(),
	paymentTerms: yup
		.mixed<'EFT' | 'Cash'>()
		.oneOf(['EFT', 'Cash'], 'Payment terms must be selected')
		.required('Payment terms must be selected'),
});

const PriceBuilderModal: React.FC<PriceBuilderModalProps> = ({ onClose, onDataRecieve, categoryId }) => {
	// state:
	const [pricingData, setPricingData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<any>(null);
	const [selectedItems, setSelectedItems] = useState<{ [key: string]: string[] }>({});
	const [totalPrice, setTotalPrice] = useState(0);
	const [category, setCategory] = useState<string>(categoryId);

	// accordion key persistence for the styling:
	const [activeAccordionKey, setActiveAccordionKey] = useState(null);


	// Invoice modal display code:
	const [showModal, setShowModal] = useState(false);
	const handleOpenModal = () => {
		setShowModal(true);
	};
	const handleCloseModal = () => {
		setShowModal(false);
	};
	// ---------------------------------------------

	// pagination and form data state:
	const [currentStep, setCurrentStep] = useState(1);

	// React Hook Form setup
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			billToAddress: '',
			additionalNotes: '',
			paymentTerms: undefined,
		},
	});

	// useEffect to fetch data:
	useEffect(() => {
		console.log(category)
		const fetchPricingData = async () => {
			setIsLoading(true);
			try {
				setPricingData(pricingArray);
				setIsLoading(false);
				// console.log('Pricing data loaded', pricingData);
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
		pricingData.forEach((element) => {
			const categoryName = element.name;
			const selectedSizes = selectedItems[categoryName] || [];

			selectedSizes.forEach((selectedSize) => {
				const index = element.sizes
					? element.sizes.indexOf(selectedSize)
					: element.bedrooms.indexOf(selectedSize);

				if (index !== -1) {
					const price =
						typeof element.prices[index] === 'string'
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
		setSelectedItems((prev) => {
			const currentCategoryItems = prev[categoryName] || [];
			const updatedCategoryItems = currentCategoryItems.includes(size)
				? currentCategoryItems.filter((item) => item !== size)
				: [...currentCategoryItems, size];

			return {
				...prev,
				[categoryName]: updatedCategoryItems,
			};
		});
	};

	const onSubmitFirstStep = (event: React.FormEvent) => {
		event.preventDefault();
		setCurrentStep(2);
	};

	const onSubmitFinalStep = (data: FormData) => {
		const selectedItemsWithPrices = pricingData.flatMap((element) => {
			const categoryName = element.name;
			const selectedSizes = selectedItems[categoryName] || [];

			return selectedSizes.map((selectedSize) => {
				const index = element.sizes
					? element.sizes.indexOf(selectedSize)
					: element.bedrooms.indexOf(selectedSize);

				const price =
					typeof element.prices[index] === 'string'
						? parseFloat(element.prices[index])
						: element.prices[index];

				return {
					category: categoryName,
					size: selectedSize,
					price: price,
				};
			});
		});

		console.log('Selected items with prices:', selectedItemsWithPrices);
		console.log('Form data:', data);
		console.log('Total Price:', totalPrice);

		// Your submit logic here
		// For example, you might want to send this data to an API
		onDataRecieve([selectedItems, data, totalPrice]);

		onClose();
	};

	// Handle going back to previous step
	const handlePrevStep = () => {
		setCurrentStep(1);
	};

	return (
		<>
			<Modal  show={true} className={`${styles.modal} modal-xl`} onHide={onClose}>
				<Modal.Header className={`${styles.modalHeader}`} closeButton>
					<Modal.Title className={`${styles.modalTitle}`}>Select items to be cleaned!</Modal.Title>
				</Modal.Header>
				<Modal.Body className={`${styles.modalBody}`}>
					{/* Total Price Display */}
					<div className={`${styles.alert} alert alert-info text-center mb-3`}>
						<strong>Total Price: R{totalPrice.toFixed(2)}</strong>
					</div>

					{currentStep === 1 && category && (
						<>
							<Form onSubmit={onSubmitFirstStep}>
								<p>Page 1/2</p>
								<h4>Select items: </h4>
								
								<Accordion className={styles.accordion} defaultActiveKey={[`${category}`]}
								
								>
									{pricingData?.length > 0 && !isLoading ? (
										<div>
											{pricingData.map((element, index) => (
												<Accordion.Item
													className={`${styles.accordionItem}`}
													key={index}
													eventKey={String(index)}
												>
													<Accordion.Header className={styles.accordionHeader}>
														{element.name}
													</Accordion.Header>
													<Accordion.Body 
														className={`${styles.accordionBody}`}
													>
														{element.sizes
															? element.sizes.map(
																	(size: string, i: number) => (
																		<FormCheck
																			key={i}
																			type="checkbox"
																			id={`${element.name}-${size}`}
																			label={`${size}: R${element.prices[i]}`}
																			checked={(
																				selectedItems[
																					element.name
																				] || []
																			).includes(size)}
																			onChange={() =>
																				handleItemSelect(
																					element.name,
																					size
																				)
																			}
																		/>
																	)
																)
															: element.bedrooms?.map(
																	(
																		bedroom: string,
																		i: number
																	) => (
																		<FormCheck
																			key={i}
																			type="checkbox"
																			id={`${element.name}-${bedroom}`}
																			label={`${bedroom} Bedrooms: R${element.prices[i]}`}
																			checked={(
																				selectedItems[
																					element.name
																				] || []
																			).includes(bedroom)}
																			onChange={() =>
																				handleItemSelect(
																					element.name,
																					bedroom
																				)
																			}
																		/>
																	)
																)}
													</Accordion.Body>
												</Accordion.Item>
											))}
										</div>
									) : (
										'...loading'
									)}
								</Accordion>

								<br />

								<Button type="submit" variant="primary">
									Next
								</Button>
							</Form>
						</>
					)}

					{currentStep === 2 && (
						<Form onSubmit={handleSubmit(onSubmitFinalStep)}>
							<Controller
								name="name"
								control={control}
								render={({ field }) => (
									<Form.Group controlId="formName" className="mb-3">
										<Form.Label>Full Name</Form.Label>
										<Form.Control
											{...field}
											type="text"
											placeholder="Enter full name"
											isInvalid={!!errors.name}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.name?.message}
										</Form.Control.Feedback>
									</Form.Group>
								)}
							/>

							<Controller
								name="email"
								control={control}
								render={({ field }) => (
									<Form.Group controlId="formEmail" className="mb-3">
										<Form.Label>Email Address</Form.Label>
										<Form.Control
											{...field}
											type="email"
											placeholder="Enter email"
											isInvalid={!!errors.email}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.email?.message}
										</Form.Control.Feedback>
									</Form.Group>
								)}
							/>

							<Controller
								name="phone"
								control={control}
								render={({ field }) => (
									<Form.Group controlId="formPhone" className="mb-3">
										<Form.Label>Phone Number</Form.Label>
										<Form.Control
											{...field}
											type="tel"
											placeholder="Enter 10-digit phone number"
											isInvalid={!!errors.phone}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.phone?.message}
										</Form.Control.Feedback>
									</Form.Group>
								)}
							/>

							<Controller
								name="billToAddress"
								control={control}
								render={({ field }) => (
									<Form.Group controlId="formBillToAddress" className="mb-3">
										<Form.Label>Billing Address</Form.Label>
										<Form.Control
											{...field}
											as="textarea"
											rows={3}
											placeholder="Enter billing address"
											isInvalid={!!errors.billToAddress}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.billToAddress?.message}
										</Form.Control.Feedback>
									</Form.Group>
								)}
							/>

							<Controller
								name="additionalNotes"
								control={control}
								render={({ field }) => (
									<Form.Group controlId="formAdditionalNotes" className="mb-3">
										<Form.Label>Additional Notes (Optional)</Form.Label>
										<Form.Control
											{...field}
											as="textarea"
											rows={3}
											placeholder="Enter any additional notes"
										/>
									</Form.Group>
								)}
							/>

							<Controller
								name="paymentTerms"
								control={control}
								render={({ field }) => (
									<Form.Group controlId="formPaymentTerms" className="mb-3">
										<Form.Label>Payment Terms</Form.Label>
										<Form.Select {...field} isInvalid={!!errors.paymentTerms}>
											<option value="">Select Payment Terms</option>
											<option value="EFT">EFT</option>
											<option value="Cash">Cash</option>
										</Form.Select>
										<Form.Control.Feedback type="invalid">
											{errors.paymentTerms?.message}
										</Form.Control.Feedback>
									</Form.Group>
								)}
							/>

							<div className="d-flex justify-content-between">
								<Button variant="secondary" onClick={() => setCurrentStep(1)}>
									Previous
								</Button>
								<Button variant="danger" onClick={onClose}>
									Cancel
								</Button>
								<Button type="submit" variant="primary">
									Submit Order
								</Button>
							</div>
						</Form>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default PriceBuilderModal;
