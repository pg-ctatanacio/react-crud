import { GitHub } from "@mui/icons-material";
import { Button, Container, Typography } from "@mui/material";
import { PaletteColorOptions, ThemeProvider, createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
	interface CustomPalette {
		dark: PaletteColorOptions;
	}
	interface Palette extends CustomPalette {}
	interface PaletteOptions extends CustomPalette {}
}

declare module "@mui/material/Button" {
	interface ButtonPropsColorOverrides {
		dark: true;
	}
}

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: any) => augmentColor({ color: { main: mainColor } });

const theme = createTheme({
	palette: {
		dark: createColor("#212121"),
	},
});

const CustomFooter = () => {
	return (
		<ThemeProvider theme={theme}>
			<Container sx={{ my: 5 }}>
				<Typography component="div" textAlign="center">
					<Button
						size="small"
						color="dark"
						variant="contained"
						startIcon={<GitHub />}
						sx={{ mr: 2 }}>
						Github Repository
					</Button>
					<Typography component="span" fontSize={13} fontWeight="fontWeightMedium">
						By: Cris Atanacio
					</Typography>
				</Typography>
			</Container>
		</ThemeProvider>
	);
};

export default CustomFooter;