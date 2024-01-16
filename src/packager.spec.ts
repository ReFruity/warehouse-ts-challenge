import { Packager } from './packager';
import { Package } from './types';

const heatPumps = [{
  "id": "934024-fn5re2-4nf023942",
  "productCode": "ACE4",
  "name": "Ace 4",
  "description": "Most popular heat pump in the Netherlands",
  "stock": 1,
  "unitPrice": 6778
}];

const installationMaterials = [{
  "id": "g02394i-f123323-234fvkm43id-12321",
  "productCode": "VA1/4",
  "name": "Vibration absorbers, 1/4",
  "description": "Vibration absorbers, 1/4",
  "stock": 33,
  "unitPrice": 4.78
}];

const tools = [{
  "id": "gh-3209452",
  "productCode": "HAMMER",
  "name": "Hammer, 5 lbs",
  "description": "",
  "stock": 12
}];

const inventory = {
  heatPumps,
  installationMaterials,
  tools,
};

describe('Packager', () => {
  describe('formSinglePackage', () => {
    it('makes a package', () => {
      const order = {
        "id": "rt30wi-12nf-25u-dm3r032ko4",
        "articles": [
          "934024-fn5re2-4nf023942",
          "g02394i-f123323-234fvkm43id-12321",
          "g02394i-f123323-234fvkm43id-12321",
          "gh-3209452",
        ],
        "installationDate": "2024-01-12T00:00:00.000Z"
      };

      const packager = new Packager(inventory);

      const actualPackage = packager.formSinglePackage(order);
      const expectedMaterial = structuredClone(installationMaterials[0]);
      expectedMaterial.stock -= 2;
      const expectedHeatPump = structuredClone(heatPumps[0]);
      expectedHeatPump.stock -= 1;
      const expectedTool = structuredClone(tools[0]);
      expectedTool.stock -= 1;
      const expectedPackage: Package = {
        orderId: order.id,
        totalPrice: 6787.56,
        installationDate: "2024-01-12T00:00:00.000Z",
        items: [
          expectedHeatPump,
          expectedMaterial,
          expectedMaterial,
          expectedTool,
        ],
      };
      expect(actualPackage).toEqual(expectedPackage);
    });
  });

  describe('packageItems', () => {
    it('throws when item is out of stock', () => {
      const order = {
        "id": "rt30wi-12nf-25u-dm3r032ko4",
        "articles": [
          "934024-fn5re2-4nf023942",
          "934024-fn5re2-4nf023942",
        ],
        "installationDate": "2024-01-12T00:00:00.000Z"
      };

      const packager = new Packager(inventory);
      const actualItems = packager.packageItems(order);

      expect(actualItems).toEqual(null);
      expect(packager.inventory.heatPumps).toEqual(heatPumps); // heat pumps inventory should not be modified
    });

    it('throws when there are articles not present in inventory', () => {
      const order = {
        "id": "rt30wi-12nf-25u-dm3r032ko4",
        "articles": [
          "non-existing-id",
        ],
        "installationDate": "2024-01-12T00:00:00.000Z"
      };

      const packager = new Packager(inventory);

      expect(() => packager.packageItems(order)).toThrow();
    });
  });

  describe('calculateTotalPrice', () => {
    it('calculates total price', () => {
      const order = {
        "id": "rt30wi-12nf-25u-dm3r032ko4",
        "articles": [
          "934024-fn5re2-4nf023942",
          "g02394i-f123323-234fvkm43id-12321",
          "g02394i-f123323-234fvkm43id-12321",
          "gh-3209452",
        ],
        "installationDate": "2024-01-12T00:00:00.000Z"
      };
      const packager = new Packager(inventory);

      expect(packager.calculateTotalPrice(order)).toBe(6787.56);
    });
  });

  describe('getRunningOutOfStockItems', () => {
    it('returns only item running out of stock', () => {
      const packager = new Packager(inventory);
      const actual = packager.getRunningOutOfStockItems(2);
      expect(actual).toEqual([heatPumps[0]]);
    });
  });
});
