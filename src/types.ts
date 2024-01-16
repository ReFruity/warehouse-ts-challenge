import { Packager } from './packager';

export interface Order {
  id: string;
  articles: string[];
  installationDate: string;
}

export interface Item {
  id: string;
  productCode: string;
  name: string;
  description: string;
  stock: number;
}

export interface Priced {
  unitPrice: number;
}

export interface Tool extends Item {}

export interface HeatPump extends Item, Priced {}

export interface InstallationMaterial extends Item, Priced {}

export interface Package {
  orderId: string;
  totalPrice: number;
  installationDate: string;
  items: Item[];
}

export interface Inventory {
  heatPumps: HeatPump[];
  installationMaterials: InstallationMaterial[];
  tools: Tool[];
}

export interface PackagingResult {
  packages: Package[];
  runningOutOfStock: Item[];
}
