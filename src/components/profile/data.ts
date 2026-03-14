import { FaqItem, MenuItem, ScreenKey } from './types';

export const MENU_ITEMS: MenuItem[] = [
  { key: 'change-password', label: 'Change Password' },
  { key: 'help-support', label: 'Help & Support' },
  { key: 'faqs', label: 'FAQ' },
  { key: 'account-settings', label: 'Account Settings' },
  { key: 'terms', label: 'Terms and conditions' },
  { key: 'privacy-policy', label: 'Privacy Policy' },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'verify-account',
    question: 'How Do I Verify My Account?',
    answer:
      'Go to Profile > Verification and upload your Emirates ID or Passport. Our team verifies profiles within 24 to 48 hours.',
  },
  {
    id: 'listing-stays',
    question: 'How Long Do Listings Stay Active?',
    answer:
      'Listings remain active for 30 days by default. You can renew or archive listings from your dashboard at any time.',
  },
  {
    id: 'track-order',
    question: 'How Do I Track My Order?',
    answer:
      'Open Orders and tap your order number. You will see real-time status updates, ETA, and delivery history there.',
  },
  {
    id: 'returns',
    question: 'Can I Return An Item?',
    answer:
      'Yes. Most items can be returned within 7 days if unused and in original condition. Some categories may be non-returnable.',
  },
];

export const SCREEN_TITLES: Record<ScreenKey, string> = {
  menu: 'Profile',
  'change-password': 'Change Password',
  'help-support': 'Help & Support',
  faqs: 'FAQs',
  'account-settings': 'Account Settings',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms and conditions',
};
