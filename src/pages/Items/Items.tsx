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

            // console.log(data);
            // data.map((v:  any) => {
            //     console.log(v);
            // })
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

                    // itemRows.push(itemRow);

                    return itemRow;
                })

                itemRows = [...itemRows, ...row];
            })

            console.log(itemRows);

            setRows(itemRows);

			// setCategories(Object.values(data));
		});
	}, []);

    const handleEditClick = (id: any) => {
        handleOpenEditModal();
        console.log(id);
    }

    const renderButton = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
        // console.log(params.id);
        return (
            <Button onClick={() => handleEditClick(params.id)}>Test</Button>
        )
    }

    const itemColumns: GridColDef[] = [
        { field: "category", headerName: "Category", width: 180 },
        { field: "name", headerName: "Name", width: 200 },
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

const columns: GridColDef[] = [
	{ field: "id", headerName: "ID", width: 70 },
	{ field: "firstName", headerName: "First name", width: 130 },
	{ field: "lastName", headerName: "Last name", width: 130 },
	{
		field: "age",
		headerName: "Age",
		type: "number",
		width: 90,
	},
	{
		field: "fullName",
		headerName: "Full name",
		description: "This column has a value getter and is not sortable.",
		sortable: false,
		width: 160,
		valueGetter: (params: GridValueGetterParams) =>
			`${params.row.firstName || ""} ${params.row.lastName || ""}`,
	},
];



const rows = [
	{ id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
	{ id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
	{ id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
	{ id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
	{ id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
	{ id: 6, lastName: "Melisandre", firstName: null, age: 150 },
	{ id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
	{ id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
	{ id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const DataTable = () => {
	return (
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid
				rows={rows}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: { page: 0, pageSize: 5 },
					},
				}}
				pageSizeOptions={[5, 10]}
				checkboxSelection
			/>
		</div>
	);
};

export default Items;
