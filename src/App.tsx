import React, { useEffect, useLayoutEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import database from "./utils/firebase";
import { onValue, push, ref, set } from "firebase/database";
import {
	Box,
	Button,
	Card,
	CardContent,
	Checkbox,
	Container,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	Input,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Step,
	StepLabel,
	Stepper,
	TextField,
	Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

function App() {
	const [categories, setCategories] = useState<string[]>([]);

	useLayoutEffect(() => {
		console.log("useeffect called..");
		// firebase.
		const query = ref(database, "test");
		return onValue(query, (snapshot) => {
			const data = snapshot.val();

			console.log(data);

			setCategories(Object.values(data));

			// if (snapshot.exists()) {
			//     Object.values(data).map((project) => {
			//         setProjects((projects) => [...projects, project]);
			//     });
			// }
		});
	}, []);

	const handleClick = () => {
		push(ref(database, "items"), {
			category: "Drinks",
			name: "Iced Tea",
			is_single_sized: false,
			price: 15.0,
			cost: 10,
			stocks: 5,
		});
	};

	return <NewOrderForm />;

	// return (
	//     <div style={{
	//         width: 500,
	//         display: 'flex',
	//         alignSelf: 'center'
	//     }}>
	//         <span>Hello World</span>
	//         <FormControl fullWidth>
	//             <Select
	//                 labelId="demo-simple-select-label"
	//                 id="demo-simple-select"
	//                 // value={age}
	//                 label="Category"
	//                 defaultValue=""
	//                 // onChange={handleChange}
	//             >
	//                 {
	//                     categories.map((v, i) => {
	//                         return <MenuItem key={i} value={v}>{v}</MenuItem>
	//                     })
	//                 }
	//             </Select>

	//             <Button variant="contained" onClick={handleClick}>Test</Button>
	//         </FormControl>
	//     </div>
	// );
}

const steps = ["Shipping address", "Payment details", "Review your order"];

const NewOrderForm = () => {
	const [categories, setCategories] = useState<string[]>([]);
	const [isSingleSized, setIsSingleSized] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useLayoutEffect(() => {
		const query = ref(database, "test");
		return onValue(query, (snapshot) => {
			const data = snapshot.val();
			setCategories(Object.values(data));
		});
	}, []);

	useEffect(() => {
		console.log("isSingleSized: ", isSingleSized);
	}, [isSingleSized]);

	const handleSaveClick = () => {
		setIsLoading(true);

        push(ref(database, "items"), {
			category: "Drinks",
			name: "Iced Tea",
			is_single_sized: false,
			price: 15.0,
			cost: 10,
			stocks: 5,
		});

		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	};

	return (
		<Container maxWidth="sm">
			<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Container disableGutters sx={{ mb: 2}}>
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
						variant="outlined"
						size="small"
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
					<FormControl sx={{ mb: 2 }} fullWidth>
						<InputLabel id="item-size-label" size="small">
							Size
						</InputLabel>
						<Select
							labelId="item-size-label"
							label="Size"
							defaultValue=""
							size="small"
							disabled={isLoading}>
							<MenuItem value="Small">Small</MenuItem>
							<MenuItem value="Medium">Medium</MenuItem>
						</Select>
					</FormControl>
				)}
				<FormControl sx={{ mb: 2 }} fullWidth>
					<TextField
						id="outlined-basic"
						label="Stocks"
						variant="outlined"
						size="small"
						type="number"
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

export default App;
