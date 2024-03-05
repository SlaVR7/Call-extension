import { store } from '../../store/store.ts';

export function getName(callingNumber: string) {
  const targetContact = store.callsAndContacts.contacts.find(
    (contact) => contact.number === callingNumber
  );
  return targetContact?.name;
}
