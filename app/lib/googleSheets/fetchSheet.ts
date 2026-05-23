import { SHEET_ID } from "./sheetsConfig";

// fetch and convert google sheet into typed array
export async function fetchSheet<T>(sheetName: string): Promise<T[]> {
	try {
		// build google sheets gviz url
		const url =
			`https://docs.google.com/spreadsheets/d/${SHEET_ID}` +
			`/gviz/tq?tqx=out:json&sheet=${sheetName}`;

		const response = await fetch(url, {
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch sheet: ${sheetName}`);
		}

		const text = await response.text();

		// remove google wrapper and parse json
		const json = JSON.parse(text.substring(47).slice(0, -2));

		// const columns = json.table.cols;
		// const rows = json.table.rows;
		// const headers = columns.map((column: any) => column.label);

		const rows = json.table.rows;

		// fallback headers from first row if labels are empty
		const columns = json.table.cols || [];

		let headers = columns.map((c: any) => c.label);

		// if headers are empty → derive from first row structure
		if (!headers.length || headers.every((h: string) => !h)) {
			const firstRow = rows[0];

			headers = firstRow?.c?.map((_: any, i: number) => `col_${i}`) || [];
		}

		// map rows into objects using column headers
		return rows.map((row: any) => {
			const item: Record<string, any> = {};

			headers.forEach((header: string, index: number) => {
				item[header] = row.c[index]?.v ?? null;
			});

			return item as T;
		});
	} catch (error) {
		console.error(`Google Sheets Error (${sheetName})`, error);

		return [];
	}
}
