import React, { SyntheticEvent, forwardRef, useLayoutEffect, useState } from "react";
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
import { Sizes, Variant, Item } from "../../types";
import useItemFormHandler from "./useItemFormHandler";
import VariantFormTest from "./VariantFormTest";
import useFirebaseRef from "./useFirebaseRef";

type ItemFormParam = {
	onSubmitClick?: (item: Item) => void;
};

const ItemFormTest = forwardRef(({ onSubmitClick }: ItemFormParam, ref) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
    const categories = useFirebaseRef('categories');
    const sizes = useFirebaseRef('sizes');
	const {
		item,
		setItemCategory,
		setItemName,
		setIsSingleSized,
		setVariants,
		setItemPrice,
		setItemCost,
		setItemStocks,
		handleSubmit,
	} = useItemFormHandler();

	const handleVariantTypeChange = (value: string, index: number) => {
		item.variants[index].type = value;
		setVariants(item.variants);
	};

	const handleVariantPriceChange = (value: number, index: number) => {
		item.variants[index].price = value;
		setVariants(item.variants);
	};

	const handleVariantCostChange = (value: number, index: number) => {
		item.variants[index].cost = value;
		setVariants(item.variants);
	};

	const handleVariantStocksChange = (value: number, index: number) => {
		item.variants[index].stocks = value;
		setVariants(item.variants);
	};

	const handleVariantAdd = () => {
		let prevVariants = item.variants.slice();
		prevVariants.push({
			type: "",
			price: 0,
			cost: 0,
			stocks: 0,
		});
		setVariants(prevVariants);
	};

	const handleVariantDelete = (index: number) => {
		let prevVariants = item.variants.slice();
		if (prevVariants.length === 1) {
			return;
		}

		prevVariants.splice(index, 1);
		setVariants(prevVariants);
	};

	const handleItemSubmit = (item: Item) => {
		onSubmitClick && onSubmitClick(item);
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
				<FormControl sx={{ mb: 2 }} fullWidth error={item.errors.category !== undefined}>
					<InputLabel id="item-category-label" size="small">
						Category
					</InputLabel>
					<Select
						labelId="item-category-label"
						label="Category"
						defaultValue=""
						size="small"
						value={item.category}
						onChange={(e: SelectChangeEvent) => setItemCategory(e.target.value)}
						disabled={isLoading}>
						{categories.map((v, i) => {
							return (
								<MenuItem key={i} value={v}>
									{v}
								</MenuItem>
							);
						})}
					</Select>
					{item.errors.category !== undefined && (
						<FormHelperText>{item.errors.category}</FormHelperText>
					)}
				</FormControl>
				<FormControl sx={{ mb: 2 }} fullWidth>
					<TextField
						id="outlined-basic"
						label="Name"
						variant="outlined"
						size="small"
						value={item.name}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setItemName(e.target.value)
						}
						disabled={isLoading}
						onFocus={(event) => {
							event.target.select();
						}}
						autoComplete="off"
						error={item.errors.name !== undefined}
						helperText={item.errors.name}
					/>
				</FormControl>
				{item.isSingleSized ? (
					<>
						<FormControl sx={{ mb: 2 }} fullWidth>
							<TextField
								id="outlined-basic"
								label="Price"
								variant="outlined"
								size="small"
								type="number"
								value={item.price}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setItemPrice(parseInt(e.target.value))
								}
								onFocus={(event) => {
									event.target.select();
								}}
								disabled={isLoading}
								error={item.errors.price !== undefined}
								helperText={item.errors.price}
							/>
						</FormControl>
						<FormControl sx={{ mb: 2 }} fullWidth>
							<TextField
								id="outlined-basic"
								label="Cost"
								variant="outlined"
								size="small"
								type="number"
								value={item.cost}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setItemCost(parseInt(e.target.value))
								}
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
								value={item.stocks}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setItemStocks(parseInt(e.target.value))
								}
								onFocus={(event) => {
									event.target.select();
								}}
								disabled={isLoading}
							/>
						</FormControl>
					</>
				) : (
					<Container disableGutters sx={{ mb: 2 }}>
						{item.variants.map((variant, i) => {
							return (
								<VariantFormTest
									key={i}
									variant={variant}
									sizes={sizes}
									handleTypeChange={(val) => handleVariantTypeChange(val, i)}
									handlePriceChange={(val) => handleVariantPriceChange(val, i)}
									handleCostChange={(val) => handleVariantCostChange(val, i)}
									handleStocksChange={(val) => handleVariantStocksChange(val, i)}
									handleDeleteVariant={() => handleVariantDelete(i)}
									error={item.errors.variant && item.errors.variant[i]}
								/>
							);
						})}
						<Button size="medium" variant="contained" onClick={handleVariantAdd}>
							Add Item Variant
						</Button>
					</Container>
				)}
				<FormGroup sx={{ mb: 2 }}>
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								checked={item.isSingleSized}
								disabled={isLoading}
								onClick={() => setIsSingleSized(!item.isSingleSized)}
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
						onClick={() => handleSubmit(handleItemSubmit)}
						loading={isLoading}>
						Save Item
					</LoadingButton>
				</FormGroup>
			</Paper>
		</Container>
	);
});

export default ItemFormTest;
