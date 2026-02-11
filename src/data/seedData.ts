import { STORAGE_KEYS } from '../constants';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { mockUsers } from './mockUsers';
import { mockTickets } from './mockTickets';

export function seedInitialData(): void {
  // Only seed if data doesn't exist
  const existingUsers = getStorageItem(STORAGE_KEYS.USERS);
  const existingTickets = getStorageItem(STORAGE_KEYS.TICKETS);

  if (!existingUsers) {
    setStorageItem(STORAGE_KEYS.USERS, mockUsers);
  }

  if (!existingTickets) {
    setStorageItem(STORAGE_KEYS.TICKETS, mockTickets);
  }

  // Set default theme if not set
  const existingTheme = getStorageItem(STORAGE_KEYS.THEME);
  if (!existingTheme) {
    setStorageItem(STORAGE_KEYS.THEME, 'light');
  }
}
