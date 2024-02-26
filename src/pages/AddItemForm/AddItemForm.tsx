import React, { SyntheticEvent, useLayoutEffect, useState } from "react";
import { DataSnapshot, onValue, push, ref, set } from "firebase/database";
import {
	Button,
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
import ItemSizeForm from "./ItemSizeForm";
import { Sizes, Variant } from "../../types";

const AddItemForm = () => {
	const navigate = useNavigate();

	const [categories, setCategories] = useState<string[]>([]);
	const [sizes, setSizes] = useState<Sizes[]>([]);
	const [isSingleSized, setIsSingleSized] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [errors, setErrors] = useState<Record<string, any>>({});

	const [category, setCategory] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [price, setPrice] = useState<number>(0);
	const [cost, setCost] = useState<number>(0);
	const [stocks, setStocks] = useState<number>(0);
	const [variants, setVariants] = useState<Variant[]>([
		{
			type: "",
			price: 0,
			cost: 0,
			stocks: 0,
		},
	]);

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
					title: val,
				};
			});
			setSizes(converted);
		});
	}, []);

	const handleSaveClick = () => {
		setIsLoading(true);
		let itemSizes: Record<string, any> = [];
		if (isSingleSized) {
			itemSizes.push({
				type: "Default",
				price: price,
				cost: cost,
				stocks: stocks,
			});
		} else {
			itemSizes = variants;
		}

		const errorObj = validateForm();
		if (Object.keys(errorObj).length > 0) {
			setErrors(errorObj);
			setIsLoading(false);
		} else {
			setTimeout(() => {
				push(ref(database, "items"), {
					category: category,
					name: capitalizedFirst(name),
					is_single_sized: isSingleSized,
					sizes: itemSizes,
				}).then(() => {
					clearItemForm();
					setIsLoading(false);
					navigate("/");
				});
			}, 500);
		}
	};

	const validateForm = () => {
		let errorRecord: Record<string, any> = {};
		if (name === "") {
			errorRecord.name = "Item name is required.";
		}

		if (category === "") {
			errorRecord.category = "Item category is required.";
		}

		if (!isSingleSized) {
			let errors: Record<string, any>[] = [];
			variants.map((variant, i) => {
				let variantRecord: Record<string, any> = {};
				if (variant.price === 0) {
					variantRecord.price = "Price required.";
				}

				if (variant.type === "") {
					variantRecord.type = "Type required.";
				}

				if (Object.keys(variantRecord).length > 0) {
					errors[i] = variantRecord;
				}
			});

			if (errors.length > 0) {
				errorRecord.variants = errors;
			}
		} else {
			if (price === 0) {
				errorRecord.price = "Item must have a valid price.";
			}
		}

		return errorRecord;
	};

	const clearItemForm = () => {
		setCategory("");
		setName("");
		setPrice(0);
		setCost(0);
		setStocks(0);
		setIsSingleSized(true);
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.currentTarget.value);
	};

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, idx?: number) => {
		if (idx !== undefined) {
			let prevVariants = variants.slice();
			prevVariants[idx].price = parseInt(e.currentTarget.value);
			setVariants(prevVariants);
		} else {
			setPrice(parseInt(e.currentTarget.value));
		}
	};

	const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>, idx?: number) => {
		if (idx !== undefined) {
			let prevVariants = variants.slice();
			prevVariants[idx].cost = parseInt(e.currentTarget.value);
			setVariants(prevVariants);
		} else {
			setCost(parseInt(e.currentTarget.value));
		}
	};

	const handleCategoryChange = (e: SelectChangeEvent) => {
		setCategory(e.target.value);
	};

	const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>, idx?: number) => {
		if (idx !== undefined) {
			let prevVariants = variants.slice();
			prevVariants[idx].stocks = parseInt(e.currentTarget.value);
			setVariants(prevVariants);
		} else {
			setStocks(parseInt(e.target.value));
		}
	};

	const handleSizeChange = (value: Sizes | null, idx?: number) => {
		if (idx !== undefined && value) {
			let prevVariants = variants.slice();
			prevVariants[idx].type = value.title;
			setVariants(prevVariants);
		}
	};

	const handleDeleteVariant = (idx: number) => {
		let prevVariants = variants.slice();
		if (prevVariants.length === 1) {
			return;
		}

		prevVariants.splice(idx, 1);
		setVariants(prevVariants);
	};

	return (
		<Container maxWidth="md">
			<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
				<Container disableGutters sx={{ mb: 2 }}>
					<Typography component="h1" variant="h6">
						New Item
					</Typography>
					<Typography variant="caption">Fill up form below to add new item.</Typography>
				</Container>
				<FormControl sx={{ mb: 2 }} fullWidth error={errors.category !== undefined}>
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
					{errors.category !== undefined && <FormHelperText>{errors.category}</FormHelperText>}
				</FormControl>
				<FormControl sx={{ mb: 2 }} fullWidth>
					<TextField
						id="outlined-basic"
						label="Name"
						variant="outlined"
						size="small"
						value={name}
						onChange={handleNameChange}
						disabled={isLoading}
						onFocus={(event) => {
							event.target.select();
						}}
						autoComplete="off"
						error={errors.name !== undefined}
						helperText={errors.name}
					/>
				</FormControl>
				{isSingleSized ? (
					<>
						<FormControl sx={{ mb: 2 }} fullWidth>
							<TextField
								id="outlined-basic"
								label="Price"
								variant="outlined"
								size="small"
								type="number"
								value={price}
								onChange={handlePriceChange}
								onFocus={(event) => {
									event.target.select();
								}}
								disabled={isLoading}
								error={errors.price !== undefined}
								helperText={errors.price}
							/>
						</FormControl>
						<FormControl sx={{ mb: 2 }} fullWidth>
							<TextField
								id="outlined-basic"
								label="Cost"
								variant="outlined"
								size="small"
								type="number"
								value={cost}
								onChange={handleCostChange}
								onFocus={(event) => {
									event.target.select();
								}}
								disabled={isLoading}
							/>
						</FormControl>
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
								onFocus={(event) => {
									event.target.select();
								}}
								disabled={isLoading}
							/>
						</FormControl>
					</>
				) : (
					<Container disableGutters sx={{ mb: 2 }}>
						{variants.map((variant, i) => {
							return (
								<ItemSizeForm
									key={i}
									variant={variant}
									idx={i}
									sizes={sizes}
									handleSizeChange={handleSizeChange}
									handlePriceChange={handlePriceChange}
									handleCostChange={handleCostChange}
									handleStocksChange={handleStockChange}
									handleDeleteVariant={handleDeleteVariant}
									error={errors.variants !== undefined ? errors.variants[i] : {}}
								/>
							);
						})}
						<Button
							size="medium"
							variant="contained"
							onClick={() => {
								let prevVariants = variants.slice();
								prevVariants.push({
									type: "",
									price: 0,
									cost: 0,
									stocks: 0,
								});
								setVariants(prevVariants);

								console.log(prevVariants);
							}}
						>
							Add Item Variant
						</Button>
					</Container>
				)}
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

export default AddItemForm;
