import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';


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
    orderId: string;
    onClose: () => void;
}

const InvoiceGeneratorModal: React.FC<InvoiceModalProps> = ({ orderId, onClose }) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`/api/invoices/${orderId}`, {
                    responseType: 'blob'
                });

                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(pdfBlob);
                setPdfUrl(url);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to load invoice');
                setIsLoading(false);
            }
        };

        fetchInvoice();

        // Cleanup to revoke blob URL
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [orderId]);

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `invoice_${orderId}.pdf`;
            link.click();
        }
    };

    return (
        <Modal show={true} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Invoice Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                        <p>Loading invoice...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    <div>
                        <iframe 
                            src={pdfUrl || undefined} 
                            width="100%" 
                            height="500px" 
                            title="Invoice PDF"
                        />
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleDownload} 
                    disabled={!pdfUrl}
                >
                    Download Invoice
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InvoiceGeneratorModal;