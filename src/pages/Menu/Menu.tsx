import { useLayoutEffect } from "react";

import database from "../../utils/firebase";
import { onValue, ref } from "firebase/database";
import { Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Menu = () => {
    const navigate = useNavigate();

	useLayoutEffect(() => {
		const query = ref(database, "items");
		return onValue(query, (snapshot) => {
			const data = snapshot.val();
			console.log(data);
		});
	}, []);

	return (
		<Container maxWidth="sm">
			<Container disableGutters sx={{ mb: 2, display: 'flex', verticalAlign: 'center', alignItems: 'center' }}>
                <Container disableGutters>
                    <Typography component="h1" variant="h6">
                        Test
                    </Typography>
                    <Typography variant="caption">Fill up form below to add new item.</Typography>
                </Container>
                <Button variant="contained" onClick={() => navigate('/add-item')}>Test</Button>
			</Container>

            <Container disableGutters sx={{marginBottom: 2 }}>
                <Container disableGutters sx={{ marginBottom: 2}}>
                    <Typography variant="subtitle2">
                        Category 1
                    </Typography>
                    <Typography variant="caption">Fill up form below to add new item.</Typography>
                </Container>
                <Grid container spacing={1} sx={{ marginX: 'auto' }}>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                </Grid>
            </Container>

            <Container disableGutters>
                <Container disableGutters sx={{ marginBottom: 2}}>
                    <Typography variant="subtitle2">
                        Category 2
                    </Typography>
                    <Typography variant="caption">Fill up form below to add new item.</Typography>
                </Container>
                <Grid container spacing={1} sx={{ marginX: 'auto' }}>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                    <Grid item><CustomButton /></Grid>
                </Grid>
            </Container>
           
		</Container>
	);
};

const CustomButton = () => {
    return (
        <Button variant="outlined" sx={{ height: 100, width: 100 }}>
            <span>SPR LNG TXT SMPL</span>
            <span style={{
                position: 'absolute',
                fontSize: 10,
                left: 10,
                bottom: 5
            }}>1</span>
        </Button>
    )
}

export default Menu;
