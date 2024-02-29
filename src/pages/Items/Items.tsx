import { useEffect, useLayoutEffect, useState } from "react";
import { onValue, push, ref, set } from "firebase/database";
import { DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import { Box, Button, Container, Modal, Typography, styled } from "@mui/material";
import { AddCircleOutline, Edit } from "@mui/icons-material";
import ItemForm from "../ItemForm";
import CustomFooter from "../../components/CustomFooter";
import { database, getRef } from "../../utils/firebase";
import { capitalizedFirst } from "../../utils/text";
import { Item } from "../../types";

const Items = () => {
	const [rows, setRows] = useState<Item[]>([]);
	const [openEditModal, setOpenEditModal] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [item, setItem] = useState<Item>({
		category: "",
		name: "",
		price: 0,
		cost: 0,
		stocks: 0,
		variants: [
			{
				type: "",
				price: 0,
				cost: 0,
				stocks: 0,
			},
		],
		isSingleSized: true,
		errors: {},
	});
	const handleOpenEditModal = () => setOpenEditModal(true);
	const handleCloseEditModal = () => setOpenEditModal(false);

	// get items list and parse
	useLayoutEffect(() => {
		const query = ref(database, "items");
		return onValue(query, (snapshot) => {
			const data = snapshot.val();
			if (data === null) {
				return;
			}

			let itemRows: any = [];
			Object.keys(data).forEach((k) => {
				let rowObj = data[k];

				// loop thru sizes to get variants
				let row = rowObj.sizes.map((v: any, i: number) => {
					let itemRow: Partial<Item> = {};
					itemRow.id = k + "_" + i;
					itemRow.firebaseId = k;
					itemRow.category = rowObj.category;
					itemRow.name = rowObj.name;
					itemRow.size = v.type;
					itemRow.price = v.price;
					itemRow.cost = v.cost;
					itemRow.stocks = v.stocks;
					return itemRow;
				});

				itemRows = [...itemRows, ...row];
			});

			setRows(itemRows);
		});
	}, []);

	useEffect(() => {
		if (openEditModal === false) {
			resetItem();
		}
	}, [openEditModal]);

	const handleEditClick = async (id: any) => {
		const itemDetails = await getRef("items/" + id);

		if (!itemDetails) {
			console.error("No item details.");
			return;
		}

		setItem({
			firebaseId: id,
			category: itemDetails.category,
			name: itemDetails.name,
			price: itemDetails.is_single_sized ? itemDetails.sizes[0].price : itemDetails.price,
			cost: itemDetails.is_single_sized ? itemDetails.sizes[0].cost : itemDetails.cost,
			stocks: itemDetails.is_single_sized ? itemDetails.sizes[0].stocks : itemDetails.stocks,
			isSingleSized: itemDetails.is_single_sized,
			variants: itemDetails.sizes,
		});

		handleOpenEditModal();
	};

	const handleItemSubmitClick = (item: Item) => {
		if (item.errors && Object.keys(item.errors).length > 0) {
			return;
		}

		let itemSizes: Record<string, any> = [];
		if (item.isSingleSized) {
			itemSizes.push({
				type: "Default",
				price: item.price,
				cost: item.cost,
				stocks: item.stocks,
			});
		} else {
			itemSizes = item.variants;
		}

		setIsLoading(true);

		// Add timeout to show loading..
		setTimeout(() => {
			if (item.firebaseId) {
				set(ref(database, "items/" + item.firebaseId), {
					category: item.category,
					name: capitalizedFirst(item.name),
					is_single_sized: item.isSingleSized,
					sizes: itemSizes,
				}).then(() => {
					setIsLoading(false);
					resetItem();
					setOpenEditModal(false);
				});
			} else {
				push(ref(database, "items"), {
					category: item.category,
					name: capitalizedFirst(item.name),
					is_single_sized: item.isSingleSized,
					sizes: itemSizes,
				}).then(() => {
					setIsLoading(false);
					resetItem();
					setOpenEditModal(false);
				});
			}
		}, 500);
	};

	const resetItem = () => {
		setItem({
			category: "",
			name: "",
			price: 0,
			cost: 0,
			stocks: 0,
			variants: [
				{
					type: "",
					price: 0,
					cost: 0,
					stocks: 0,
				},
			],
			isSingleSized: true,
			errors: {},
		});
	};

	const renderButton = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
		return (
			<Button
				startIcon={<Edit />}
				color="warning"
				onClick={() => handleEditClick(params.row.firebaseId)}
			>
				Edit
			</Button>
		);
	};

	const CustomNoRowsOverlay = () => {
		return (
			<StyledGridOverlay>
				<svg width="120" height="100" viewBox="0 0 184 152" aria-hidden focusable="false">
					<g fill="none" fillRule="evenodd">
						<g transform="translate(24 31.67)">
							<ellipse
								className="ant-empty-img-5"
								cx="67.797"
								cy="106.89"
								rx="67.797"
								ry="12.668"
							/>
							<path
								className="ant-empty-img-1"
								d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
							/>
							<path
								className="ant-empty-img-2"
								d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
							/>
							<path
								className="ant-empty-img-3"
								d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
							/>
						</g>
						<path
							className="ant-empty-img-3"
							d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
						/>
						<g className="ant-empty-img-4" transform="translate(149.65 15.383)">
							<ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
							<path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
						</g>
					</g>
				</svg>
				<Box sx={{ mt: 1 }}>No Rows</Box>
			</StyledGridOverlay>
		);
	};

	const itemColumns: GridColDef[] = [
		{ field: "category", headerName: "Category", width: 180 },
		{ field: "name", headerName: "Name", flex: 1, minWidth: 200 },
		{ field: "size", headerName: "Size", width: 100 },
		{
			field: "price",
			headerName: "Price",
			type: "number",
			width: 130,
		},
		{
			field: "cost",
			headerName: "Cost",
			type: "number",
			width: 130,
		},
		{
			field: "stocks",
			headerName: "Stocks",
			type: "number",
			width: 130,
		},
		{
			field: "id",
			headerName: "",
			width: 130,
			align: "right",
			sortable: false,
			filterable: false,
			renderCell: renderButton,
		},
	];

	return (
		<Container>
			<Container
				disableGutters
				sx={{ my: 2, display: "flex", verticalAlign: "center", alignItems: "center" }}
			>
				<Container disableGutters>
					<Typography component="h1" variant="h6">
						Items
					</Typography>
					<Typography variant="caption">Items below will show up in your menu.</Typography>
				</Container>
				<Container disableGutters>
					<Button
						variant="contained"
						onClick={() => setOpenEditModal(true)}
						startIcon={<AddCircleOutline />}
						sx={{ float: "right" }}
					>
						Add Item
					</Button>
				</Container>
			</Container>
			<Container disableGutters>
				<DataGrid
					autoHeight={true}
					rows={rows}
					columns={itemColumns}
					initialState={{
						pagination: {
							paginationModel: { page: 0, pageSize: 20 },
						},
					}}
					pageSizeOptions={[5, 10, 20, 50, 100]}
					slots={{
						noRowsOverlay: CustomNoRowsOverlay,
					}}
				/>
			</Container>
			<Modal keepMounted open={openEditModal} onClose={handleCloseEditModal}>
				<ItemForm
					item={item}
					isLoading={isLoading}
					onSubmitClick={handleItemSubmitClick}
					onCloseClick={handleCloseEditModal}
				/>
			</Modal>
			<CustomFooter />
		</Container>
	);
};

const StyledGridOverlay = styled("div")(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	height: "100%",
	"& .ant-empty-img-1": {
		fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
	},
	"& .ant-empty-img-2": {
		fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
	},
	"& .ant-empty-img-3": {
		fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
	},
	"& .ant-empty-img-4": {
		fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
	},
	"& .ant-empty-img-5": {
		fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
		fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
	},
}));

export default Items;
