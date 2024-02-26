import { Route, Routes } from "react-router-dom";

import AddItemForm from "./pages/AddItemForm";
import Menu from "./pages/Menu";
import Sales from "./pages/Sales";

import "./App.css";
import Items from "./pages/Items";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Items />} />
			<Route path="/menu" element={<Menu />} />
			<Route path="/add-item" element={<AddItemForm />} />
			<Route path="/sales" element={<Sales />} />
		</Routes>
	);
}

export default App;
