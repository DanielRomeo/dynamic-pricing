const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
	cors({
		origin: 'http://localhost:3000', // Adjust to your frontend's URL
		methods: ['POST'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
);
app.use(bodyParser.json());

// Routes
app.post('/generate-invoice', async (req, res) => {
	console.log('Invoice generation request received');

	try {
		const response = await axios.post('https://invoice-generator.com', req.body, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
				'Content-Type': 'application/json',
			},
			responseType: 'arraybuffer', // Important for PDF handling
		});

		// Set headers to indicate PDF content
		res.set({
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline; filename=invoice.pdf',
		});

		// Send the PDF data directly
		res.send(response.data);
	} catch (error) {
		console.error('Error generating invoice:', error.message);

		// More detailed error handling
		if (error.response) {
			// The request was made and the server responded with a status code
			res.status(error.response.status).json({
				error: error.response.data.message || 'External API error',
			});
		} else if (error.request) {
			// The request was made but no response was received
			res.status(500).json({
				error: 'No response received from invoice generation service',
			});
		} else {
			// Something happened in setting up the request
			res.status(500).json({
				error: error.message || 'Unknown error occurred',
			});
		}
	}
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
