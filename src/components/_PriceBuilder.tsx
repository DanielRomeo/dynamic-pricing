import React, { useState } from 'react';
import { Modal, Button, Form, Accordion, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import pricingData from '../pricing-data.json';

interface PriceBuilderModalProps {
	onClose: () => void;
	initialSection?: string;
}

const PriceBuilderModal: React.FC<PriceBuilderModalProps> = ({
	onClose,
	initialSection = 'Rugs',
}) => {
	const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
	});

	const handleItemSelect = (section: string, item: string) => {
		setSelectedItems((prevSelectedItems) => ({
			...prevSelectedItems,
			[`${section}:${item}`]: !prevSelectedItems[`${section}:${item}`],
		}));
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
		onClose();
	};

	return (
		<Modal show={true} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Price Builder</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{/* <Accordion defaultActiveKey={initialSection}>
          {Object.keys(pricingData).map((section) => (
            <Card key={section}>
              <Accordion.Toggle as={Card.Header} eventKey={section}>
                {section}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={section}>
                <Card.Body>
                  {section === 'Rugs' && (
                    <ListGroup>
                      {pricingData.rugs.sizes.map((size) => (
                        <ListGroupItem
                          key={size}
                          active={selectedItems[`Rugs:${size}`]}
                          onClick={() => handleItemSelect('Rugs', size)}
                          style={{ cursor: 'pointer' }}
                        >
                          {size} - R {pricingData.rugs.prices[pricingData.rugs.sizes.indexOf(size)].toFixed(2)}
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  )} 
                  
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion> */}

				<ListGroup>
					{pricingData.rugs.sizes.map((size) => (
						<ListGroupItem
							key={size}
							active={selectedItems[`Rugs:${size}`]}
							onClick={() => handleItemSelect('Rugs', size)}
							style={{ cursor: 'pointer' }}
						>
							{size} - R{' '}
							{pricingData.rugs.prices[pricingData.rugs.sizes.indexOf(size)].toFixed(
								2
							)}
						</ListGroupItem>
					))}
				</ListGroup>

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
			</Modal.Body>
		</Modal>
	);
};

export default PriceBuilderModal;
