import React, { SyntheticEvent, useLayoutEffect, useState } from "react";
import { DataSnapshot, onValue, push, ref, set } from "firebase/database";
import {
	Autocomplete,
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
import database from "../../utils/firebase";
import { capitalizedFirst } from "../../utils/text";
import { useNavigate } from "react-router-dom";

type Sizes = {
	id: number;
	title: string;
};

const AddItemForm = () => {
    const navigate = useNavigate();
    
	const [categories, setCategories] = useState<string[]>([]);
	const [sizes, setSizes] = useState<Sizes[]>([]);
	const [isSingleSized, setIsSingleSized] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [category, setCategory] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [price, setPrice] = useState<number>(0.0);
	const [cost, setCost] = useState<number>(0.0);
	const [stocks, setStocks] = useState<number>(0);
	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

	useLayoutEffect(() => {
		const query = ref(database, "categories");
		return onValue(query, (snapshot) => {
			const data = snapshot.val();
			setCategories(Object.values(data));
		});
	}, []);

	useLayoutEffect(() => {
		const query = ref(database, "sizes");
		return onValue(query, (snapshot) => {
			const data = snapshot.val();
			const converted = data.map((val: DataSnapshot, i: number) => {
                return {
                    id: i,
                    title: val
                }
            });
			setSizes(converted);
		});
	}, []);

	const handleSaveClick = () => {
		setIsLoading(true);

		// Added timeout so we can see the loading.
		setTimeout(() => {
			push(ref(database, "items"), {
				category: category,
				name: capitalizedFirst(name),
				is_single_sized: isSingleSized,
				sizes: selectedSizes,
				price: price,
				stocks: stocks,
				cost: cost,
			}).then(() => {
				clearItemForm();
				setIsLoading(false);
                navigate('/');
			});
		}, 500);
	};

	const clearItemForm = () => {
		setCategory("");
		setName("");
		setPrice(0.0);
		setCost(0.0);
		setStocks(0);
		setSelectedSizes([]);
		setIsSingleSized(true);
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

	const handleSelectedSizeChange = (
		e: SyntheticEvent,
		value: { id: number; title: string }[]
	) => {
		const sortedSizes = value.sort((a, b) => a.id - b.id);
		setSelectedSizes(sortedSizes.map((o) => o.title));
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
						value={category}
						onChange={handleCategoryChange}
						disabled={isLoading}>
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
                        placeholder="Set item name."
						variant="outlined"
						size="small"
						value={name}
						onChange={handleNameChange}
						disabled={isLoading}
					/>
				</FormControl>
				<FormControl sx={{ mb: 2 }} fullWidth>
					<TextField
						id="outlined-basic"
						label="Price"
                        placeholder="Set item price."
						variant="outlined"
						size="small"
						type="number"
						value={price}
						onChange={handlePriceChange}
						disabled={isLoading}
					/>
				</FormControl>
				<FormControl sx={{ mb: 2 }} fullWidth>
					<TextField
						id="outlined-basic"
						label="Cost"
                        placeholder="Set item cost."
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
				{!isSingleSized && (
					<FormGroup sx={{ mb: 2 }}>
						<Autocomplete
							multiple
							id="tags-outlined"
							options={sizes}
                            getOptionLabel={(option) => option.title}
							size="small"
                            onChange={handleSelectedSizeChange}
							filterSelectedOptions
							renderInput={(params) => (
								<TextField {...params} label="Sizes" placeholder="Select item sizes." />
							)}
						/>
					</FormGroup>
				)}
				<FormControl sx={{ mb: 2 }} fullWidth>
					<TextField
						id="outlined-basic"
						label="Stocks"
                        placeholder="Input no. of stocks in inventory."
						variant="outlined"
						size="small"
						type="number"
                        value={stocks}
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
						loading={isLoading}>
						Save Item
					</LoadingButton>
				</FormGroup>
			</Paper>
		</Container>
	);
};

export default AddItemForm;
