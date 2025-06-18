import { useState, useEffect, useCallback } from "react";

export const useChromeStorage = <T>(key: string) => {
	const [data, setData] = useState<T | null>(null);

	useEffect(() => {
		// Load initial data
		chrome.storage.local.get(key).then((result) => {
			if (result[key]) {
				setData(result[key]);
			}
		});

		// Listen for changes
		const listener = (changes: {
			[key: string]: chrome.storage.StorageChange;
		}) => {
			if (changes[key]) {
				setData(changes[key].newValue);
			}
		};

		chrome.storage.local.onChanged.addListener(listener);
		return () => chrome.storage.local.onChanged.removeListener(listener);
	}, [key]);

	const updateData = useCallback(
		(newData: T) => {
			chrome.storage.local.set({ [key]: newData });
		},
		[key]
	);

	return { data, setData: updateData };
};
