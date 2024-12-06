import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import PriceBoxes from './components/PriceBoxes';

function App() {
	return (
		<Container>
			<h1 className="text-center my-5">Check out our prices</h1>
			<Row>
				<PriceBoxes></PriceBoxes>
			</Row>
		</Container>
	);
}

export default App;
