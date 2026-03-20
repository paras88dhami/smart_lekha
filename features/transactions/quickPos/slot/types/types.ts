export type QuickPosProductSlot = {
  id: string;
  profileId: string;
  categoryName: string;
  slotOrder: number;
  itemId: string | null;
};

export type CreateQuickPosProductSlotInput = {
  profileId: string;
  categoryName: string;
  slotOrder: number;
  itemId: string | null;
};

export type UpdateQuickPosProductSlotItemInput = {
  slotId: string;
  itemId: string | null;
};
