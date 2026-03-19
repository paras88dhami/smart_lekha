export type PosItem = {
  id: string;
  profileId: string;
  itemName: string;
  sku: string | null;
  unitPrice: number;
  availableStock: number;
  isActive: boolean;
};

export type CreatePosItemInput = {
  profileId: string;
  itemName: string;
  sku: string | null;
  unitPrice: number;
  availableStock: number;
  isActive: boolean;
};

export type PosCartLine = {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};
