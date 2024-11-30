import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, ListGroup, ListGroupItem, Nav, Accordion } from 'react-bootstrap';
import pricingData from '../pricing-data.json';

interface PriceBuilderModalProps {
	onClose: () => void;
	name: string;
}

const PriceBuilderModal: React.FC<PriceBuilderModalProps> = ({ onClose, name }) => {
	// accrodion stuff
	const [activeIndex, setActiveIndex] = useState(null);

	const handleSelect = (selectedIndex: any) => {
		setActiveIndex(selectedIndex === activeIndex ? null : selectedIndex);
	};
	// -----------------------------------------------

	// fetching json data stuff
	const [data, setData] = useState<any>();
	const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
	});
	const [currentStep, setCurrentStep] = useState(1);

	const handleItemSelect = (item: string) => {
		if (selectedItems.includes(item)) {
			setSelectedItems(selectedItems.filter((i) => i !== item));
		} else {
			setSelectedItems([...selectedItems, item]);
		}
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
		// Handle form submission, e.g., send data to server
		console.log('Selected items:', selectedItems);
		console.log('Form data:', formData);
		setCurrentStep(2);
	};

	useEffect(() => {
		const fetchDataDirectly = async () => {
			try {
			  const importedData = await import('../pricing-data.json');
			  setData(importedData.default);
			  setIsLoading(false);
			} catch (err:any) {
			  setError(err);
			  setIsLoading(false);
			}
		  };
		  fetchDataDirectly();
	}, []);

	return (
		<Modal show={true} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Price Builder</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{currentStep === 1 && (
					<>
						<h4>Select items:</h4>
						<Accordion
							defaultActiveKey="0"
							activeKey={activeIndex}
							onSelect={handleSelect}
						>

							
								

							{/* {Object.keys(pricingData).forEach((section) => (
								
								<Accordion.Item eventKey={section}>
								<Accordion.Header>{section}</Accordion.Header>
								<Accordion.Body>
								{pricingData.rugs.sizes.map((size) => (
									<ListGroupItem
									key={size}
									// active={selectedItems[`Rugs:${size}`]}
									// onClick={() => handleItemSelect('Rugs', size)}
									style={{ cursor: 'pointer' }}
									>
									{size} - R {pricingData.rugs.prices[pricingData.rugs.sizes.indexOf(size)].toFixed(2)}
									</ListGroupItem>
								))}
								</Accordion.Body>
							</Accordion.Item>
							))} */}

								{data ? Object.keys(pricingData).forEach(key => (
									<div>sam</div>

								)) : ''}
								


							{/* <Accordion.Item eventKey="0">
								<Accordion.Header>Accordion Item #1</Accordion.Header>
								<Accordion.Body>stuff</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="1">
								<Accordion.Header>Accordion Item #2</Accordion.Header>
								<Accordion.Body>
									Duis aute irure dolor in reprehenderit in voluptate velit esse
									cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
									cupidatat non proident, sunt in culpa qui officia deserunt
									mollit anim id est laborum.  
								</Accordion.Body>
							</Accordion.Item> */}
						</Accordion>
					</>
				)}

				{currentStep === 2 && (
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="formName">
							<Form.Label>Name</Form.Label>
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
							<Form.Label>Phone</Form.Label>
							<Form.Control
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleInputChange}
								required
							/>
						</Form.Group>
						<div className="text-right">
							<Button variant="secondary" onClick={onClose}>
								Cancel
							</Button>
							<Button variant="primary" type="submit">
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
