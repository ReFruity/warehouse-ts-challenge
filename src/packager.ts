import { Inventory, Item, Order, Package, PackagingResult } from './types';
import { isPriced, round } from './util';

// If item's stock amount is below MIN_STOCK, it is included in runningOutOfStock list
const MIN_STOCK = 2;

export class Packager {
  inventory: Inventory;
  itemsByArticle: Map<string, Item>;

  constructor(inventory: Inventory) {
    this.inventory = structuredClone(inventory);
    this.itemsByArticle = new Map<string, Item>();
    this.inventory.tools.forEach((tool) => this.itemsByArticle.set(tool.id, tool));
    this.inventory.installationMaterials.forEach((material) => this.itemsByArticle.set(material.id, material));
    this.inventory.heatPumps.forEach((pump) => this.itemsByArticle.set(pump.id, pump));
  }

  calculateTotalPrice(order: Order): number {
    let result: number = 0;

    for (const article of order.articles) {
      const item = this.itemsByArticle.get(article);

      if (item === undefined) {
        continue;
      }

      if (isPriced(item)) {
        result += item.unitPrice;
      }
    }

    // TODO: Without this round tests do not pass.
    // But this potentially has financial implications. Better approach would be not to round, but
    // instead use epsilon comparison in tests
    return round(result, 2);
  }

  // TODO: This should be split into several smaller functions
  packageItems(order: Order): Item[] | null {
    const result: Item[] = [];
    const orderItemCounts = new Map<string, number>();
    order.articles.forEach((article) => orderItemCounts.set(article, 0));

    for (const article of order.articles) {
      const item = this.itemsByArticle.get(article);

      if (item === undefined) {
        throw new Error(`Item with article "${order.id}" was not found in the inventory.`)
      }

      const count = orderItemCounts.get(article);

      if (count === undefined) {
        throw new Error('Inconsistent orderItemCounts map');
      }

      orderItemCounts.set(article, count + 1);

      result.push(item);
    }

    for (const entry of orderItemCounts.entries()) {
      const article = entry[0];
      const count = entry[1];
      const inventoryItem = this.itemsByArticle.get(article);

      if (inventoryItem === undefined) {
        throw new Error(`Inconsistent itemsByArticle map. No article "${article}" found.`);
      }

      if (inventoryItem.stock < count) {
        return null;
      }
    }

    for (const entry of orderItemCounts.entries()) {
      const article = entry[0];
      const count = entry[1];
      const inventoryItem = this.itemsByArticle.get(article);

      if (inventoryItem === undefined) {
        throw new Error(`Inconsistent itemsByArticle map. No article ${article} found.`);
      }

      inventoryItem.stock -= count;
    }

    return result;
  }

  formSinglePackage(order: Order): Package | null {
    const items = this.packageItems(order);

    if (items === null) {
      return null;
    }

    const totalPrice = this.calculateTotalPrice(order);

    const result: Package = {
      orderId: order.id,
      totalPrice,
      installationDate: order.installationDate,
      items,
    }

    return result;
  }

  getRunningOutOfStockItems(minStock: number = MIN_STOCK): Item[] {
    const result: Item[] = [];

    for (const entry of this.itemsByArticle.entries()) {
      const item = entry[1];
      if (item.stock < MIN_STOCK) {
        result.push(item);
      }
    }

    return result;
  }
}

/**
 * Forms packages from given orders and inventory.
 * If a package cannot be formed due to the insufficient items in the inventory,
 * it writes a warning to stdout and does not include this order in the package list.
 * If order includes articles not present in inventory, it throws an error.
 */
export function formPackages(orders: Order[], inventory: Inventory): PackagingResult {
  const result: Package[] = [];
  const packager = new Packager(inventory);

  for (const order of orders) {
    const singlePackage = packager.formSinglePackage(order);

    if (singlePackage === null) {
      console.log(`Warning: cannot form package for order. Insufficient items. Order: ${JSON.stringify(order, null, 2)}`);
    } else {
      result.push(singlePackage);
    }
  }

  return {
    packages: result,
    runningOutOfStock: packager.getRunningOutOfStockItems(),
  };
}
