import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";
import { ClientSecretCredential } from "@azure/identity";
import "isomorphic-fetch";

const tenantId = 'bsnengineering.onmicrosoft.com';
const clientId = '61f259ef-4e2e-4c38-bc99-ca678686e880';
const clientSecret = 'AiS8Q~TxiKlRqXI1u41C-X2UKCz8axF~vZgg2b0j';

async function main() {
  try {
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ["https://graph.microsoft.com/.default"],
    });

    const client = Client.initWithMiddleware({
      debugLogging: false,
      authProvider,
    });

    console.log("Fetching site by hostname and path...");
    const site = await client.api('/sites/bsnengineering.sharepoint.com:/sites/QualityBSNEngineering2').get();
    console.log("Site ID:", site.id);

    console.log("Fetching drive...");
    const drive = await client.api(`/sites/${site.id}/drive`).get();
    console.log("Drive ID:", drive.id);

    // The user provided sourcedoc={8380349D-23FB-4C65-AA09-243B23E25011}. Let's see if we can get it by id
    const itemId = "8380349D-23FB-4C65-AA09-243B23E25011";
    console.log(`Fetching item ${itemId} from drive...`);
    const item = await client.api(`/drives/${drive.id}/items/${itemId}`).get();
    console.log("Item Name:", item.name);

    // Let's try to get worksheets
    const worksheets = await client.api(`/drives/${drive.id}/items/${itemId}/workbook/worksheets`).get();
    console.log("Worksheets:", worksheets.value.map(w => w.name));

    // Try to get usedRange of first worksheet
    const firstSheet = worksheets.value[0].id;
    const usedRange = await client.api(`/drives/${drive.id}/items/${itemId}/workbook/worksheets/${firstSheet}/usedRange`).get();
    
    console.log("Data sample:");
    console.log(usedRange.values.slice(0, 5));

  } catch (error) {
    console.error("Error:", error.message || error);
    if (error.body) {
      console.error(error.body);
    }
  }
}

main();
