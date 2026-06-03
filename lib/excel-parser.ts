import { getDriveId, graphClient } from "./sharepoint";

export interface Indicator {
  objectif: string;
  indicateur: string;
  cible: string;
  resultat: string;
  autre: string | null;
}

export interface Axis {
  title: string;
  indicators: Indicator[];
}

export async function getDashboardData(): Promise<Axis[]> {
  const driveId = await getDriveId();
  const itemId = process.env.SHAREPOINT_DRIVE_ITEM_ID;
  
  // We fetch 'text' instead of 'values' to get the formatted strings (e.g. "60%" instead of 0.6)
  const usedRange = await graphClient.api(`/drives/${driveId}/items/${itemId}/workbook/worksheets/Feuil1/usedRange`).get();
  
  const rows = usedRange.text; // Use text to avoid number conversion issues
  const axes: Axis[] = [];
  
  let currentAxis: Axis | null = null;
  let isReadingData = false;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const firstCell = String(row[0] || "").trim();

    // Check if the row is an Axis title
    if (firstCell.toLowerCase().startsWith("axe")) {
      currentAxis = {
        title: firstCell,
        indicators: []
      };
      axes.push(currentAxis);
      isReadingData = false;
      continue;
    }

    // Check if it's the header row before data
    if (firstCell.toLowerCase().startsWith("objectif")) {
      isReadingData = true;
      continue;
    }

    // Read indicator data
    if (isReadingData && currentAxis && firstCell !== "") {
      const indicator: Indicator = {
        objectif: firstCell,
        indicateur: String(row[1] || "").trim(),
        cible: String(row[2] || "").trim(),
        resultat: String(row[3] || "").trim(),
        autre: row[4] !== undefined && row[4] !== "" ? String(row[4]).trim() : null
      };
      currentAxis.indicators.push(indicator);
    }
  }

  return axes;
}
