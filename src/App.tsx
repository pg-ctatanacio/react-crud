import { Route, Routes } from "react-router-dom";

import Menu from "./pages/Menu";

import "./App.css";
import Items from "./pages/Items";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Items />} />
			<Route path="/menu" element={<Menu />} />
		</Routes>
	);
}

export default App;
