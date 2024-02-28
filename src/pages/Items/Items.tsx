import React, { SyntheticEvent, useEffect, useLayoutEffect, useState } from "react";
import { DataSnapshot, onValue, push, ref, set } from "firebase/database";
import {
	DataGrid,
	GridColDef,
	GridRenderCellParams,
	GridTreeNodeWithRender,
} from "@mui/x-data-grid";
import { Button, Container, Modal, Typography } from "@mui/material";
import ItemForm from "../ItemForm";
import { database, getRef } from "../../utils/firebase";
import { capitalizedFirst } from "../../utils/text";
import { Item, Variant } from "../../types";

const Items = () => {
	const [rows, setRows] = useState<Item[]>([]);
	const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [itemToUpdate, setItemToUpdate] = useState<Item>();
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
					itemRow.id = k + '_' + i;
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

            console.log(itemRows);

			setRows(itemRows);
		});
	}, []);

    useEffect(() => {
        if (openEditModal === false) {
            setItemToUpdate(undefined);
        }
    }, [openEditModal]);

	const handleEditClick = async (id: any) => {
        const itemDetails = await getRef('items/' + id);

        if (!itemDetails) {
            console.error('No item details.');
            return;
        }

        setItemToUpdate({
            firebaseId: id,
            category: itemDetails.category,
            name: itemDetails.name,
            price: itemDetails.is_single_sized ? itemDetails.sizes[0].price : itemDetails.price,
            cost: itemDetails.is_single_sized ? itemDetails.sizes[0].cost : itemDetails.cost,
            stocks: itemDetails.is_single_sized ? itemDetails.sizes[0].stocks : itemDetails.stocks,
            isSingleSized: itemDetails.is_single_sized,
            variants: itemDetails.sizes
        });

		handleOpenEditModal();
	};

    const handleItemSubmitClick = (item: Item) => {
		// setIsLoading(true);
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

		setTimeout(() => {
            if (itemToUpdate) {
                console.log('updating item..');
                set(ref(database, "items/" + item.firebaseId), {
                    category: item.category,
                	name: capitalizedFirst(item.name),
                	is_single_sized: item.isSingleSized,
                	sizes: itemSizes,
                }).then(() => {
                	// clearItemForm();
                	// setIsLoading(false);
                	// navigate("/");
                	setOpenEditModal(false);
                });
            } else {
                console.log('adding to items..');

                push(ref(database, "items"), {
                	category: item.category,
                	name: capitalizedFirst(item.name),
                	is_single_sized: item.isSingleSized,
                	sizes: itemSizes,
                }).then(() => {
                	// clearItemForm();
                	// setIsLoading(false);
                	// navigate("/");
                	setOpenEditModal(false);
                });
            }
		}, 500);
	};

	const renderButton = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
		return <Button onClick={() => handleEditClick(params.row.firebaseId)}>Test</Button>;
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
						Test
					</Typography>
					<Typography variant="caption">Fill up form below to add new item.</Typography>
				</Container>
				<Button variant="contained" onClick={() => setOpenEditModal(true)}>
					Test
				</Button>
			</Container>
			<div style={{ height: 371, width: "100%" }}>
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
			</div>

			<Modal keepMounted open={openEditModal} onClose={handleCloseEditModal}>
				<ItemForm onSubmitClick={handleItemSubmitClick} itemToUpdate={itemToUpdate} />
			</Modal>
		</Container>
	);
};

export default Items;
