const SHEET_ID = "11pwUAg4xvoaHpSvuo9j_dLSBtmo39Rh0PKLJIDX1Y-o";

export async function fetchGoogleSheet<T>(
  sheetName: string
): Promise<T[]> {
  try {
    const url =
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}` +
      `/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch sheet: ${sheetName}`
      );
    }

    const text = await response.text();

    const json = JSON.parse(
      text.substring(47).slice(0, -2)
    );

    const columns = json.table.cols;
    const rows = json.table.rows;

    const headers = columns.map(
      (column: any) => column.label
    );

    return rows.map((row: any) => {
      const item: Record<string, any> = {};

      headers.forEach(
        (header: string, index: number) => {
          item[header] =
            row.c[index]?.v ?? null;
        }
      );

      return item as T;
    });
  } catch (error) {
    console.error(
      `Google Sheets Error (${sheetName})`,
      error
    );

    return [];
  }
}