const SHEET_ID = "11pwUAg4xvoaHpSvuo9j_dLSBtmo39Rh0PKLJIDX1Y-o";

export async function fetchGoogleSheet<T>(sheetName: string): Promise<T[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${sheetName}`);
    }

    const text = await response.text();

    // Google returns weird wrapped JSON
    const json = JSON.parse(text.substring(47).slice(0, -2));

    const cols = json.table.cols;
    const rows = json.table.rows;

    const headers = cols.map((col: any) => col.label);

    return rows.map((row: any) => {
      const obj: Record<string, any> = {};

      headers.forEach((header: string, index: number) => {
        obj[header] = row.c[index]?.v ?? null;
      });

      return obj as T;
    });
  } catch (error) {
    console.error(`Google Sheets Error (${sheetName})`, error);
    return [];
  }
}