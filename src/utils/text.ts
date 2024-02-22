const capitalizedFirst = (text: string) => {
	return text
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export { capitalizedFirst };
