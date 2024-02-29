import {
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
import { VariantFormProps } from "../../types";
import { ChangeEvent } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const VariantForm = ({
	variant,
	sizes,
	handleTypeChange,
	handlePriceChange,
	handleCostChange,
	handleStocksChange,
	handleDeleteVariant,
	error,
}: VariantFormProps) => {
	return (
		<Container disableGutters sx={{ mb: 2 }}>
			<Grid container spacing={1} sx={{ mb: 1 }}>
				<Grid item xs={5}>
					<FormControl fullWidth error={error && error.type !== undefined}>
						<InputLabel id="item-size-label" size="small">
							Sizes
						</InputLabel>
						<Select
							labelId="item-size-label"
							label="Sizes"
							defaultValue=""
							size="small"
							value={variant.type}
							onChange={(e) => handleTypeChange(e.target.value)}
							// disabled={isLoading}
						>
							{sizes.map((value, index) => {
								return (
									<MenuItem key={index} value={value}>
										{value}
									</MenuItem>
								);
							})}
						</Select>

						{error && error.type !== undefined && (
							<FormHelperText>{error.type}</FormHelperText>
						)}
					</FormControl>
				</Grid>
				<Grid item xs={2}>
					<TextField
						id="outlined-basic"
						label="Price"
						value={variant.price}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							handlePriceChange(parseInt(e.target.value))
						}
						variant="outlined"
						size="small"
						type="number"
						autoComplete="off"
						error={error && error.price !== undefined}
						helperText={error && error.price}
					/>
				</Grid>
				<Grid item xs={2}>
					<TextField
						id="outlined-basic"
						label="Cost"
						value={variant.cost}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							handleCostChange(parseInt(e.target.value))
						}
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
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							handleStocksChange(parseInt(e.target.value))
						}
						variant="outlined"
						size="small"
						type="number"
						autoComplete="off"
					/>
				</Grid>
				<Grid item xs={1} sx={{  }}>
					<IconButton aria-label="delete" color="error" onClick={handleDeleteVariant} >
						<DeleteIcon />
					</IconButton>
				</Grid>
			</Grid>
		</Container>
	);
};

export default VariantForm;
