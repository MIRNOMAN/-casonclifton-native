export type ScreenKey =
  | 'menu'
  | 'change-password'
  | 'help-support'
  | 'faqs'
  | 'account-settings'
  | 'privacy-policy'
  | 'terms';

export type MenuItem = {
  key: ScreenKey;
  label: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type ProfileFormValues = {
  fullName: string;
  accountEmail: string;
  sex: string;
  phoneNumber: string;
  location: string;
  profilePhotoUrl?: string | null;
};
