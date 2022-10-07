export interface RentalItem {
  name: string;
  collectionName: string;
  price: number;
  image: string;
  endAt: number;
}

enum StorageKey {
  'rentedItems' = 'RENTED_ITEMS',
}

export class LocalStroage {
  private static local: Storage;

  static get rentedItems(): RentalItem[] {
    LocalStroage.initialize();

    const items = this.local.getItem(StorageKey.rentedItems);
    console.log('items', items);
    if (!items) {
      return [];
    }

    return JSON.parse(items) as unknown as RentalItem[];
  }

  static initialize() {
    if (this.local == null) {
      if (typeof window !== 'undefined') {
        this.local = window.localStorage;
      } else {
        throw new Error('Can not access local storage');
      }
    }
  }

  static setRentedItems(item: RentalItem): void {
    this.initialize();

    if (this.rentedItems.find((i) => i.name === item.name)) return;

    this.local.setItem(
      StorageKey.rentedItems,
      JSON.stringify(this.rentedItems.concat(item))
    );
  }
}
