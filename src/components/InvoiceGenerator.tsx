import React, { useState, useEffect } from 'react';
import {
	Container,
	Row,
	Col,
	Card,
	Table,
	Button,
	Modal,
	Spinner,
	ModalBody,
} from 'react-bootstrap';
import axios from 'axios';
import { MY_ENV_VAR } from '../config/config';
import styles from '../styles/invoiceGenerator.module.scss'

// information I need from client:
/*
first and last name
bill to  address
items(already have)
additional notes(textArea)
payment terms
*/

// info that i need to provide:
/*
generate the invoice number
date of invoice
due date(date of service rendering)


*/

interface InvoiceModalProps {
	data: any[];
	onClose: () => void;
}

const InvoiceGeneratorModal: React.FC<InvoiceModalProps> = ({ data, onClose }) => {
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const generateInvoice = async () => {
		setLoading(true);
		setError(null);
		try {
			const invoiceData = {
				from: 'Nikolaus Ltd',
				to: 'Acme, Corp.',
				logo: 'https://example.com/img/logo-invoice.png',
				number: 1,
				items: [{ name: 'Starter plan', quantity: 1, unit_cost: 99 }],
				notes: 'Thanks for your business!',
			};

			const response = await axios.post(
				'http://localhost:5000/generate-invoice',
				invoiceData,
				{
					headers: {
						'Content-Type': 'application/json',
					},
					responseType: 'blob', // Important for handling binary data
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

	useEffect(()=>{
		generateInvoice()
	}, [])

	return (
		<>
		<Modal show={true} className={`${styles.modalInvoiceGen} modal-xl`} onHide={onClose}>
			
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
								<Button className={styles.cancelButton} variant="primary"  onClick={onClose}>
									Cancel
								</Button>
								<Button className={styles.bookNowButton} type="submit" variant="primary">
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
