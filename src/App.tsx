import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import pricingData from './pricing-data.json';
import styles from './styles/pricing.module.scss';
import Rugs from './components/Rugs';
import Mattresses from './components/Mattresses';

function App() {
	return (
		<Container>
			<h1 className="text-center my-5">Check out our prices</h1>
			<Row>
				<Rugs></Rugs>
				{/* <Mattresses></Mattresses> */}
			</Row>
		</Container>
	);
}

export default App;
