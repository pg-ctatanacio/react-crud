import { useEffect, useLayoutEffect, useState } from "react";
import { onValue, push, ref, set } from "firebase/database";
import {
	DataGrid,
	GridColDef,
	GridRenderCellParams,
	GridTreeNodeWithRender,
} from "@mui/x-data-grid";
import { Button, Container, Modal, Typography } from "@mui/material";
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
				onClick={() => handleEditClick(params.row.firebaseId)}>
				Edit
			</Button>
		);
	};

	const itemColumns: GridColDef[] = [
		{ field: "category", headerName: "Category", width: 180 },
		{ field: "name", headerName: "Name", flex: 1 },
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
			renderCell: renderButton,
		},
	];

	return (
		<Container>
			<Container
				disableGutters
				sx={{ my: 2, display: "flex", verticalAlign: "center", alignItems: "center" }}>
				<Container disableGutters>
					<Typography component="h1" variant="h6">
						Items
					</Typography>
					<Typography variant="caption">
						Items below will show up in your menu.
					</Typography>
				</Container>
				<Container disableGutters>
					<Button
						variant="contained"
						onClick={() => setOpenEditModal(true)}
						startIcon={<AddCircleOutline />}
						sx={{ float: "right" }}>
						Add Item
					</Button>
				</Container>
			</Container>
            <Container disableGutters sx={{  height: 371 }}>
                <DataGrid
                    rows={rows}
                    columns={itemColumns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
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

export default Items;
