import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import pricingArray from './pricingDataComponent';

import Accordion from 'react-bootstrap';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface PriceBuilderModalProps {
	onClose: () => void;
	name: number;
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

const PriceBuilderModal: React.FC<PriceBuilderModalProps> = ({ onClose, name }) => {
	// state:
	const [pricingData, setPricingData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<any>(null);
	const [selectedItems, setSelectedItems] = useState<{ [key: string]: string[] }>({});
	const [totalPrice, setTotalPrice] = useState(0);

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
		const fetchPricingData = async () => {
			setIsLoading(true);
			try {
				setPricingData(pricingArray);
				setIsLoading(false);
				console.log('Pricing data loaded', pricingData);
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
		console.log('Selected items:', selectedItems);
		console.log('Form data:', data);
		// td: Add your submit logic here
		onClose();
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
					<strong>Total Price: R{totalPrice.toFixed(2)}</strong>
				</div>

				{currentStep === 1 && (
					<>
						<p>Page 1/2</p>
						<h4>Select items: </h4>
						<Form onSubmit={onSubmitFirstStep}>
							<Form.Group>
								<Form.Label className="mb-3">Select your items:</Form.Label>
								{pricingData?.length > 0 && !isLoading
									? pricingData.map((element, index) => (
											<div key={index} className="mb-3">
												<h5>{element.name}</h5>
												{element.sizes
													? element.sizes.map(
															(size: string, i: number) => (
																<Form.Check
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
															(bedroom: string, i: number) => (
																<Form.Check
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
											</div>
										))
									: '...loading'}
							</Form.Group>

							<Button type="submit" variant="primary">
								Next
							</Button>
						</Form>
					</>
				)}

				{currentStep === 2 && (
					<Form onSubmit={handleSubmit(onSubmitFinalStep)}>
						{/* Form fields with Yup validation */}
						<Controller
							name="name"
							control={control}
							render={({ field }: any) => (
								<Form.Group controlId="formName" className="mb-3">
									<Form.Label>Full Name</Form.Label>
									<Form.Control
										{...field}
										type="text"
										isInvalid={!!errors.name}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.name?.message}
									</Form.Control.Feedback>
								</Form.Group>
							)}
						/>

						{/* Similar modifications for email, phone, etc. */}
						<Controller
							name="email"
							control={control}
							render={({ field }: any) => (
								<Form.Group controlId="formEmail" className="mb-3">
									<Form.Label>Email</Form.Label>
									<Form.Control
										{...field}
										type="email"
										isInvalid={!!errors.email}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.email?.message}
									</Form.Control.Feedback>
								</Form.Group>
							)}
						/>

						{/* Remaining form fields follow the same pattern */}

						<div className="d-flex justify-content-between">
							<Button onClick={() => setCurrentStep(1)} variant="secondary">
								Prev
							</Button>
							<Button variant="danger" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" variant="primary">
								Book Now
							</Button>
						</div>
					</Form>
				)}
			</Modal.Body>
		</Modal>
	);
};

export default PriceBuilderModal;
