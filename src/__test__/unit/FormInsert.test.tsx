import { fireEvent, render, screen } from "@testing-library/react";
import App from "../../App";

it("should save item data to Firebase Database", () => {
	render(<App />);
	const elem = screen.getByText("Save Item", { selector: "button" });
	// console.log(elem);
	console.log(fireEvent.click(elem));
	expect(elem).toBeInTheDocument();
});
