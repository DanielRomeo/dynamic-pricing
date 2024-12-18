import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import PriceBoxes from './components/PriceBoxes';
import styles from './styles/app.module.scss';
// import '@import url(`https://fonts.googleapis.com/css2?family=Your+Font+Name&display=swap`)'
// import { inter, nunito } from './fonts';
import './index.css';

function App() {
	return (
		<div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F9FFFF' }}>
			<Container className={styles.container}>
				<h1 className="text-center my-5">Check out our prices</h1>
				<Row>
					<PriceBoxes></PriceBoxes>
				</Row>
			</Container>
		</div>
	);
}

export default App;
