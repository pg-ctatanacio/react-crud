import { Route, Routes } from "react-router-dom";

import AddItemForm from "./pages/AddItemForm";
import Menu from "./pages/Menu";
import Sales from "./pages/Sales";

import "./App.css";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Menu />} />
			<Route path="/add-item" element={<AddItemForm />} />
			<Route path="/sales" element={<Sales />} />
		</Routes>
	);
}

export default App;
