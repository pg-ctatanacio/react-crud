import {
	Autocomplete,
	Container,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { Sizes, VariantForm } from "../../types";
import { ChangeEvent } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const ItemSizeForm = ({
	variant,
	idx,
	sizes,
	handleSizeChange,
	handleCostChange,
	handlePriceChange,
	handleStocksChange,
	handleDeleteVariant,
	error,
}: VariantForm) => {
	return (
		<Container disableGutters sx={{ mb: 2 }}>
			<Grid container spacing={1} sx={{ mb: 1 }}>
				<Grid item xs={5}>
					<FormControl fullWidth error={error && error.type != undefined}>
						<InputLabel id="item-size-label" size="small">
							Sizes
						</InputLabel>
						<Select
							labelId="item-size-label"
							label="Sizes"
							defaultValue=""
							size="small"
							// value={category}
							onChange={(e) => handleSizeChange({ id: idx, title: e.target.value }, idx)}
							// disabled={isLoading}
						>
							{sizes.map((v, i) => {
								return (
									<MenuItem key={i} value={v.title}>
										{v.title}
									</MenuItem>
								);
							})}
						</Select>

						{error && error.type != undefined && <FormHelperText>{error.type}</FormHelperText>}
					</FormControl>
				</Grid>
				<Grid item xs={2}>
					<TextField
						id="outlined-basic"
						label="Price"
						value={variant.price}
						onChange={(e: ChangeEvent<HTMLInputElement>) => handlePriceChange(e, idx)}
						variant="outlined"
						size="small"
						type="number"
						autoComplete="off"
						error={error && error.price != undefined}
						helperText={error && error.price}
					/>
				</Grid>
				<Grid item xs={2}>
					<TextField
						id="outlined-basic"
						label="Cost"
						value={variant.cost}
						onChange={(e: ChangeEvent<HTMLInputElement>) => handleCostChange(e, idx)}
						variant="outlined"
						size="small"
						type="number"
						autoComplete="off"
					/>
				</Grid>
				<Grid item xs={2}>
					<TextField
						id="outlined-basic"
						label="Stocks"
						value={variant.stocks}
						onChange={(e: ChangeEvent<HTMLInputElement>) => handleStocksChange(e, idx)}
						variant="outlined"
						size="small"
						type="number"
						autoComplete="off"
					/>
				</Grid>
				<Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
					<IconButton aria-label="delete" color="error" onClick={() => handleDeleteVariant(idx)}>
						<DeleteIcon />
					</IconButton>
				</Grid>
			</Grid>
		</Container>
	);
};

export default ItemSizeForm;
