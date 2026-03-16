export type PhoneEntryViewModel = {
  phoneNumber: string;
  changePhoneNumber: (value: string) => void;
  continueFlow: () => void;
  closeFlow: () => void;
};
