import { useEffect, useLayoutEffect, useState } from "react";
import { Item, Variant } from "../../types";

type SubmitCallback = (data: Item) => void;

const useItemFormHandler = (newItem?: Item) => {
	const [item, setItem] = useState<Item>({
        firebaseId: undefined,
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

	useLayoutEffect(() => {
		if (newItem !== undefined) {
			setItem(newItem);
		}
	}, [newItem]);

	const validateForm = () => {
		let errorRecord: Record<string, any> = {};
		if (item.name === "") {
			errorRecord.name = "Item name is required.";
		}

		if (item.category === "") {
			errorRecord.category = "Item category is required.";
		}

		if (!item.isSingleSized) {
			let errors: Record<string, any>[] = [];
			item.variants.map((variant, i) => {
				let variantRecord: Record<string, any> = {};
				if (variant.price === 0) {
					variantRecord.price = "Price required.";
				}

				if (variant.type === "") {
					variantRecord.type = "Type required.";
				}

				if (Object.keys(variantRecord).length > 0) {
					errors[i] = variantRecord;
				}
			});

			if (errors.length > 0) {
				errorRecord.variants = errors;
			}
		} else {
			if (item.price === 0) {
				errorRecord.price = "Item must have a valid price.";
			}
		}

		return errorRecord;
	};

	const handleSubmit = (callback: SubmitCallback) => {
		const errors = validateForm();
        const newItem = { ...item };
		newItem.errors = errors;
        setItem(newItem);
		callback(newItem);
	};

	const setItemCategory = (newCategory: string) => {
		const newItem = { ...item };
		newItem.category = newCategory;
		setItem(newItem);
	};

	const setItemName = (newName: string) => {
		const newItem = { ...item };
		newItem.name = newName;
		setItem(newItem);
	};

	const setIsSingleSized = (newIsSingleSized: boolean) => {
		const newItem = { ...item };
		newItem.isSingleSized = newIsSingleSized;
		setItem(newItem);
	};

	const setItemPrice = (newPrice: number) => {
		const newItem = { ...item };
		newItem.price = newPrice;
		setItem(newItem);
	};

	const setItemCost = (newCost: number) => {
		const newItem = { ...item };
		newItem.cost = newCost;
		setItem(newItem);
	};

	const setItemStocks = (newStocks: number) => {
		const newItem = { ...item };
		newItem.stocks = newStocks;
		setItem(newItem);
	};

	const setVariants = (newVariants: Variant[]) => {
		const newItem = { ...item };
		newItem.variants = newVariants;
		setItem(newItem);
	};

	return {
		validatedItem: item,
		setItemCategory,
		setItemName,
		setIsSingleSized,
		setVariants,
		setItemPrice,
		setItemCost,
		setItemStocks,
		handleSubmit
	};
};

export default useItemFormHandler;
