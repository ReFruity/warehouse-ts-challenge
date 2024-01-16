import { HeatPump, InstallationMaterial, Order, Tool } from './types';
import { formPackages } from './packager';

const API_URL = 'http://localhost:3000'

async function getFromAPI(entity: string) {
  const request = await fetch(`${API_URL}/${entity}`);
  return await request.json();
}

async function start() {
  const orders = await getFromAPI('orders') as Order[];
  const heatPumps = await getFromAPI('heatPumps') as HeatPump[];
  const installationMaterials =
    await getFromAPI('installationMaterials') as InstallationMaterial[];
  const tools = await getFromAPI('tools') as Tool[];

  const inventory = {
    heatPumps, installationMaterials, tools
  };

  const packagingResult = formPackages(orders, inventory);

  console.log('Packages:', JSON.stringify(packagingResult.packages, null, 2));
  console.log('Items running out of stock:', JSON.stringify(packagingResult.runningOutOfStock, null, 2));
}

start().catch(console.error);
