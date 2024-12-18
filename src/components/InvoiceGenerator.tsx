import React, { useState, useEffect } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid'; // ES Module

import axios from 'axios';
import { MY_ENV_VAR } from '../config/config';
import styles from '../styles/invoiceGenerator.module.scss';

interface InvoiceModalProps {
	data: any[];
	onClose: () => void;
}

const InvoiceGeneratorModal: React.FC<InvoiceModalProps> = ({ data, onClose }) => {
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [itemsArray, setItemsArray] = useState<any[]>(data);

	const generateInvoice = async (data2: any) => {
		const uuid = await uuidv4();
		const invoiceNumber = uuid.replace(/\D/g, '').slice(0, 10);

		// date:
		const today = new Date();
		const formattedDate = today.toLocaleDateString('en-GB');

		// setting the loading and error states:
		setLoading(true);
		setError(null);

		let items = [];
		// console.log('``````````````````````````````````````');
		// console.log(itemsArray[0][0])

		let typeOfEnvironment: string;
		for (let i = 0; i < itemsArray[0].length; i++) {
			if (
				itemsArray[0][i].category === 'Before/After moving house cleaning' ||
				itemsArray[0][i].category === 'House cleaning (Once off/1 day)'
			) {
				items.push({
					name: `${itemsArray[0][i].category} - ${itemsArray[0][i].size} bedrooms`,
					quantity: 1,
					unit_cost: itemsArray[0][i].price,
				});
			} else {
				items.push({
					name: `${itemsArray[0][i].category} - ${itemsArray[0][i].size}`,
					quantity: 1,
					unit_cost: itemsArray[0][i].price,
				});
			}
		}

		try {
			const invoiceData = {
				from: 'Royal Cleaners',
				to: data[1].name,
				logo: 'https://royalcleaners.co.za/images/0/11303350/logo-no-background.png',
				number: invoiceNumber,
				items: items,
				notes: 'Thanks for your business!',
				date: formattedDate,
				terms: 'Payment method: \n FNB \n 908943543 \n Royal Cleaners Co \n  ',
				currency: 'ZAR',
			};

			const response = await axios.post(
				// 'http://localhost:5000/generate-invoice', // for development testing
				'https://dynamic-pricing-xcee.onrender.com/generate-invoice',
				invoiceData,
				{
					headers: {
						'Content-Type': 'application/json',
					},
					responseType: 'blob',
				}
			);

			// Create a blob URL for the PDF
			const blob = new Blob([response.data], { type: 'application/pdf' });
			const url = URL.createObjectURL(blob);
			setPdfUrl(url);
		} catch (err: any) {
			setError(err.response?.data || err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		generateInvoice(data);
	}, []);

	return (
		<>
			<Modal
				show={true}
				className={`${styles.modalInvoiceGen} modal-xl modal-fullscreen`}
				onHide={onClose}
			>
				<Modal.Body className={styles.modalBody}>
					{loading ? <Spinner animation="border" size="sm" /> : ' '}
					{error && <p style={{ color: 'red' }}>Error: {JSON.stringify(error)}</p>}
					{pdfUrl ? (
						<div style={{ marginTop: '20px' }}>
							<h2>Invoice Preview</h2>
							{/* Try using <object> or <embed> to render the PDF */}
							<object
								data={pdfUrl}
								type="application/pdf"
								style={{ width: '100%', height: '500px' }}
								aria-label="Invoice PDF"
							>
								<p>
									Your browser does not support PDFs.{' '}
									<a href={pdfUrl}>Download the PDF</a>.
								</p>
							</object>

							<hr />

							<div className="d-flex justify-content-between">
								<Button
									className={styles.cancelButton}
									variant="primary"
									onClick={onClose}
								>
									Cancel
								</Button>
								<Button
									className={styles.bookNowButton}
									type="submit"
									variant="primary"
								>
									BOOK NOW !
								</Button>
							</div>
						</div>
					) : (
						loading && <p>Generating Invoice!</p>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default InvoiceGeneratorModal;
