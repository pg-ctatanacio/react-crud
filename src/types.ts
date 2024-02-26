export type Variant = {
	type: string;
	price: number;
	cost: number;
	stocks: number;
};

export type Item = {
	category: string;
	name: string;
	price: number;
	cost: number;
	stocks: number;
	variant: Variant[];
};

export type VariantForm = {
	variant: Variant;
	idx: number;
	sizes: Sizes[];
	handleSizeChange: (value: Sizes | null, idx?: number) => void;
	handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>, idx?: number) => void;
	handleCostChange: (e: React.ChangeEvent<HTMLInputElement>, idx?: number) => void;
	handleStocksChange: (e: React.ChangeEvent<HTMLInputElement>, idx?: number) => void;
	handleDeleteVariant: (idx: number) => void;
	error: Record<string, any>;
};

export type Sizes = {
	id: number;
	title: string;
};
