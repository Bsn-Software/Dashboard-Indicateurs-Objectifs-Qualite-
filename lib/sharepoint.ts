import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { ClientSecretCredential } from "@azure/identity";
import "isomorphic-fetch";

const tenantId = process.env.SHAREPOINT_TENANT_ID;
const clientId = process.env.SHAREPOINT_CLIENT_ID;
const clientSecret = process.env.SHAREPOINT_CLIENT_SECRET;
const siteUrlPath = '/sites/bsnengineering.sharepoint.com:/sites/QualityBSNEngineering2'; // Extracted from URL
const itemId = process.env.SHAREPOINT_DRIVE_ITEM_ID;

if (!tenantId || !clientId || !clientSecret || !itemId) {
  throw new Error("Les variables d'environnement SharePoint ne sont pas définies.");
}

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ["https://graph.microsoft.com/.default"],
});

export const graphClient = Client.initWithMiddleware({
  debugLogging: false,
  authProvider,
});

// Cache for site and drive IDs to avoid fetching them on every request
let cachedDriveId: string | null = null;

export async function getDriveId() {
  if (cachedDriveId) return cachedDriveId;

  try {
    const site = await graphClient.api(siteUrlPath).get();
    const drive = await graphClient.api(`/sites/${site.id}/drive`).get();
    cachedDriveId = drive.id;
    return cachedDriveId;
  } catch (error) {
    console.error("Erreur lors de la récupération du Drive SharePoint:", error);
    throw error;
  }
}

export async function getExcelData(sheetName: string = "Feuil1") {
  const driveId = await getDriveId();
  try {
    const usedRange = await graphClient.api(`/drives/${driveId}/items/${itemId}/workbook/worksheets/${sheetName}/usedRange`).get();
    return usedRange.values;
  } catch (error) {
    console.error("Erreur lors de la récupération des données Excel:", error);
    throw error;
  }
}
