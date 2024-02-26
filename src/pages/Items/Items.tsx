import React, { SyntheticEvent, useLayoutEffect, useState } from "react";
import { DataSnapshot, onValue, push, ref, set } from "firebase/database";
import { DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender, GridValueGetterParams } from "@mui/x-data-grid";

import database from "../../utils/firebase";
import { Button, Container, Modal, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddItemForm from "../AddItemForm";

interface ItemColumn {
    id: string;
    category: string;
    name: string;
    size: string;
    price: number;
    cost: number;
    stocks: number;
}

const Items = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState<ItemColumn[]>([]);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const handleOpenEditModal = () => setOpenEditModal(true);
    const handleCloseEditModal = () => setOpenEditModal(false);

    // get items list and parse
    useLayoutEffect(() => {
		const query = ref(database, "items");
		return onValue(query, (snapshot) => {
			const data = snapshot.val();

            let itemRows: any = [];
            Object.keys(data).forEach((k) => {
                let rowObj = data[k];

                // loop thru sizes to get variants
                let row = rowObj.sizes.map((v: any, i: number) => {
                    let itemRow: Partial<ItemColumn> = {};
                    itemRow.id = k + i;
                    itemRow.category = rowObj.category;
                    itemRow.name = rowObj.name;
                    itemRow.size = v.type;
                    itemRow.price = v.price;
                    itemRow.cost = v.cost;
                    itemRow.stocks = v.stocks;
                    return itemRow;
                })

                itemRows = [...itemRows, ...row];
            })

            setRows(itemRows);
		});
	}, []);

    const handleEditClick = (id: any) => {
        handleOpenEditModal();
    }

    const renderButton = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
        return (
            <Button onClick={() => handleEditClick(params.id)}>Test</Button>
        )
    }

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
            align: 'right',
            renderCell: renderButton
        }
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
				<Button variant="contained" onClick={() => navigate("/add-item")}>
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

            <Modal
                keepMounted
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <AddItemForm />
            </Modal>
        </Container>
    );
};

export default Items;
