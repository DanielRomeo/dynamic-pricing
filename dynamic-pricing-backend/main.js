const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const axios = require('axios');
require('dotenv').config();

// Validate environment
const requiredEnvVars = ['PORT', 'ALL1','ALL2','ALL3', 'NODE_ENV'];
requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        console.error(`Error: ${envVar} is not set`);
        process.exit(1);
    }
});

const app = express();
const PORT = process.env.PORT || 5000;

console.log(process.env.API_KEY); 


app.use((err, req, res, next) => {
    console.error('Detailed error:', {
        message: err.message,
        stack: err.stack,
        status: err.status
    });
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// CORS configuration
// Default to allowing localhost in development, or specify origins in production
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3000/', 'https://dynamic-pricing-xcee.onrender.com/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
};

app.use(cors(corsOptions));

// Body parser with limits
app.use(bodyParser.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf
    }
}));

// Compression
app.use(compression());

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Graceful shutdown
    process.exit(1);
});

// ------------------------------------------------------------------------------------
// Routes
app.get('/message', (req, res) => {
    res.json({
        message: "ROMEO DANIEL SAYS HELLO!!!"
    });
});

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
