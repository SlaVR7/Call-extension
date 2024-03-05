import { store } from '../../store/store.ts';
import { ContactProps } from '../interfaces.ts';

export function sortContacts(): ContactProps[] {
  const contacts = store.callsAndContacts.contacts;
  return Array.from(contacts).sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return nameA.localeCompare(nameB);
  });
}
