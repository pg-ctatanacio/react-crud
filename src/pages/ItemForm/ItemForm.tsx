import React, { forwardRef, useLayoutEffect, useState } from "react";
import {
	Button,
	Checkbox,
	Container,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useItemFormHandler from "./useItemFormHandler";
import VariantForm from "./VariantForm";
import { Item } from "../../types";
import { getRef } from "../../utils/firebase";

type ItemFormParam = {
	item?: Item;
    isLoading?: boolean;
	onSubmitClick?: (item: Item) => void;
    onCloseClick?: () => void;
};

const ItemForm = forwardRef(({ item, isLoading = false, onSubmitClick, onCloseClick }: ItemFormParam, ref) => {
	const [categories, setCategories] = useState<string[]>([]);
	const [sizes, setSizes] = useState<string[]>([]);
	const {
		validatedItem,
		setItemCategory,
		setItemName,
		setIsSingleSized,
		setVariants,
		setItemPrice,
		setItemCost,
		setItemStocks,
		handleSubmit
	} = useItemFormHandler(item);

    const isUpdate = item?.firebaseId !== undefined;

	useLayoutEffect(() => {
		const initForm = async () => {
			const _categories = await getRef("categories");
			const _sizes = await getRef("sizes");
			setCategories(_categories);
			setSizes(_sizes);
		};

		initForm();
	}, []);

	const handleVariantTypeChange = (value: string, index: number) => {
		validatedItem.variants[index].type = value;
		setVariants(validatedItem.variants);
	};

	const handleVariantPriceChange = (value: number, index: number) => {
		validatedItem.variants[index].price = value;
		setVariants(validatedItem.variants);
	};

	const handleVariantCostChange = (value: number, index: number) => {
		validatedItem.variants[index].cost = value;
		setVariants(validatedItem.variants);
	};

	const handleVariantStocksChange = (value: number, index: number) => {
		validatedItem.variants[index].stocks = value;
		setVariants(validatedItem.variants);
	};

	const handleVariantAdd = () => {
		let prevVariants = validatedItem.variants.slice();
		prevVariants.push({
			type: "",
			price: 0,
			cost: 0,
			stocks: 0,
		});
		setVariants(prevVariants);
	};

	const handleVariantDelete = (index: number) => {
		let prevVariants = validatedItem.variants.slice();
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
						{isUpdate ? "Update Item" : "New Item"}
					</Typography>
					{!isUpdate && <Typography variant="caption">Fill up form below to add new item.</Typography>}
				</Container>
				<FormControl
					sx={{ mb: 2 }}
					fullWidth
					error={validatedItem.errors && validatedItem.errors.category !== undefined}>
					<InputLabel id="item-category-label" size="small">
						Category
					</InputLabel>
					<Select
						labelId="item-category-label"
						label="Category"
						defaultValue=""
						size="small"
						value={validatedItem.category}
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
					{validatedItem.errors && validatedItem.errors.category !== undefined && (
						<FormHelperText>{validatedItem.errors.category}</FormHelperText>
					)}
				</FormControl>
				<FormControl sx={{ mb: 2 }} fullWidth>
					<TextField
						id="outlined-basic"
						label="Name"
						variant="outlined"
						size="small"
						value={validatedItem.name}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setItemName(e.target.value)
						}
						disabled={isLoading}
						onFocus={(event) => {
							event.target.select();
						}}
						autoComplete="off"
						error={validatedItem.errors && validatedItem.errors.name !== undefined}
						helperText={validatedItem.errors && validatedItem.errors.name}
					/>
				</FormControl>
				{validatedItem.isSingleSized ? (
					<>
						<FormControl sx={{ mb: 2 }} fullWidth>
							<TextField
								id="outlined-basic"
								label="Price"
								variant="outlined"
								size="small"
								type="number"
								value={validatedItem.price}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setItemPrice(parseInt(e.target.value))
								}
								onFocus={(event) => {
									event.target.select();
								}}
								disabled={isLoading}
								error={validatedItem.errors && validatedItem.errors.price !== undefined}
								helperText={validatedItem.errors && validatedItem.errors.price}
							/>
						</FormControl>
						<FormControl sx={{ mb: 2 }} fullWidth>
							<TextField
								id="outlined-basic"
								label="Cost"
								variant="outlined"
								size="small"
								type="number"
								value={validatedItem.cost}
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
								value={validatedItem.stocks}
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
						{validatedItem.variants.map((variant, i) => {
							return (
								<VariantForm
									key={i}
									variant={variant}
									sizes={sizes}
									handleTypeChange={(val) => handleVariantTypeChange(val, i)}
									handlePriceChange={(val) => handleVariantPriceChange(val, i)}
									handleCostChange={(val) => handleVariantCostChange(val, i)}
									handleStocksChange={(val) => handleVariantStocksChange(val, i)}
									handleDeleteVariant={() => handleVariantDelete(i)}
									error={
										(validatedItem.errors && validatedItem.errors.variants) && validatedItem.errors.variants[i]
									}
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
								checked={validatedItem.isSingleSized}
								disabled={isLoading}
								onClick={() => setIsSingleSized(!validatedItem.isSingleSized)}
							/>
						}
						label="Single Size"
					/>
					<FormHelperText sx={{ mx: 1.5 }}>
						Uncheck if item has sizes small, medium, large etc.
					</FormHelperText>
				</FormGroup>

				<Grid container spacing={1}>
                    <Grid item xs={6}>
                        <LoadingButton
                            size="medium"
                            variant="contained"
                            onClick={() => handleSubmit(handleItemSubmit)}
                            fullWidth
                            loading={isLoading}>
                            {isUpdate ? 'Update item' : 'Save item'}
                        </LoadingButton>
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            size="medium"
                            variant="outlined"
                            onClick={onCloseClick}
                            fullWidth
                            loading={isLoading}>
                            Close
                        </LoadingButton>
                    </Grid>
				</Grid>
			</Paper>
		</Container>
	);
});

export default ItemForm;
