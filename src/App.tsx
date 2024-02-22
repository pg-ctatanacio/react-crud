import React, { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";

import database from "./utils/firebase";
import { onValue, push, ref, set } from "firebase/database";
import {
	Checkbox,
	Container,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { capitalizedFirst } from "./utils/text";

function App() {
	return <NewOrderForm />;
}

const NewOrderForm = () => {
	const [categories, setCategories] = useState<string[]>([]);
	const [isSingleSized, setIsSingleSized] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [category, setCategory] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [price, setPrice] = useState<number>(0.0);
	const [cost, setCost] = useState<number>(0.0);
	const [stocks, setStocks] = useState<number>(0);

	useLayoutEffect(() => {
		const query = ref(database, "categories");
		return onValue(query, (snapshot) => {
			const data = snapshot.val();
			setCategories(Object.values(data));
		});
	}, []);

	const handleSaveClick = () => {
		setIsLoading(true);

		push(ref(database, "items"), {
			category: category,
			name: capitalizedFirst(name),
			is_single_sized: isSingleSized,
			price: price,
			stocks: stocks,
			cost: cost,
		}).then(() => {
			setIsLoading(false);
		});
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.currentTarget.value);
	};

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPrice(parseInt(e.currentTarget.value));
	};

	const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCost(parseInt(e.currentTarget.value));
	};

	const handleCategoryChange = (e: SelectChangeEvent) => {
		setCategory(e.target.value);
	};

	const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStocks(parseInt(e.target.value));
	};

	return (
		<Container maxWidth="sm">
			<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
				<Container disableGutters sx={{ mb: 2 }}>
					<Typography component="h1" variant="h6">
						New Item
					</Typography>
					<Typography variant="caption">Fill up form below to add new item.</Typography>
				</Container>
				<FormControl sx={{ mb: 2 }} fullWidth>
					<InputLabel id="item-category-label" size="small">
						Category
					</InputLabel>
					<Select
						labelId="item-category-label"
						label="Category"
						defaultValue=""
						size="small"
						onChange={handleCategoryChange}
						disabled={isLoading}
					>
						{categories.map((v, i) => {
							return (
								<MenuItem key={i} value={v}>
									{v}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>
				<FormControl sx={{ mb: 2 }} fullWidth>
					<TextField
						id="outlined-basic"
						label="Name"
						variant="outlined"
						size="small"
						onChange={handleNameChange}
						disabled={isLoading}
					/>
				</FormControl>
				<FormControl sx={{ mb: 2 }} fullWidth>
					<TextField
						id="outlined-basic"
						label="Price"
						variant="outlined"
						size="small"
						type="number"
						onChange={handlePriceChange}
						disabled={isLoading}
					/>
				</FormControl>
				<FormControl sx={{ mb: 2 }} fullWidth>
					<TextField
						id="outlined-basic"
						label="Cost"
						variant="outlined"
						size="small"
						type="number"
						onChange={handleCostChange}
						disabled={isLoading}
					/>
				</FormControl>
				<FormGroup sx={{ mb: 2 }}>
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								checked={isSingleSized}
								disabled={isLoading}
								onClick={() => setIsSingleSized(!isSingleSized)}
							/>
						}
						label="Single Size"
					/>
					<FormHelperText sx={{ mx: 1.5 }}>
						Uncheck if item has sizes small, medium, large etc.
					</FormHelperText>
				</FormGroup>
				<FormControl sx={{ mb: 2 }} fullWidth>
					<TextField
						id="outlined-basic"
						label="Stocks"
						variant="outlined"
						size="small"
						type="number"
						onChange={handleStockChange}
						disabled={isLoading}
					/>
					<FormHelperText style={{ marginTop: 15 }}>
						Note: Empty stocks will default to '0' upon save.
					</FormHelperText>
				</FormControl>

				<FormGroup>
					<LoadingButton
						size="medium"
						variant="contained"
						onClick={handleSaveClick}
						loading={isLoading}
					>
						Save Item
					</LoadingButton>
				</FormGroup>
			</Paper>
		</Container>
	);
};

export default App;
