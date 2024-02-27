import React, { SyntheticEvent, forwardRef, useLayoutEffect, useState } from "react";
import { DataSnapshot, onValue, push, ref, set } from "firebase/database";
import database from "../../utils/firebase";

const useFirebaseRef = (path: string) => {
    const [categories, setCategories] = useState<string[]>([]);
    useLayoutEffect(() => {
		const query = ref(database, path);
		return onValue(query, (snapshot) => {
			const data = snapshot.val();
			setCategories(Object.values(data));
		});
	}, []);

    return categories;
}

export default useFirebaseRef;