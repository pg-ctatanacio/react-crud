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
	variants: Variant[];
    isSingleSized: boolean;
    errors?: Record<string, any>;
    firebaseId?: string;
    id?: string;
    size?: string;
};

export type VariantFormProps = {
    variant: Variant;
    sizes: string[];
    error: Record<string, any>;
    handleTypeChange: (value: string) => void;
    handlePriceChange: (value: number) => void;
    handleCostChange: (value: number) => void;
    handleStocksChange: (value: number) => void;
    handleDeleteVariant: () => void;
}
