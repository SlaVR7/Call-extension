import { types } from 'mobx-state-tree';
import { CallStoreProps, ContactProps, IStateData, SipDataProps } from '../lib/interfaces.ts';

const storeModel = types
  .model({
    stateData: types.model({
      currentPage: types.string,
      auth: types.boolean,
      isAuthError: types.boolean,
      isIncomingCall: types.boolean,
      isCalling: types.boolean,
      number: types.string,
      isStopWatchRunning: types.boolean,
      callStatus: types.string,
      callDuration: types.string,
      callPossibility: types.boolean,
    }),
    sipData: types.model({
      server: types.string,
      login: types.string,
      password: types.string,
      port: types.string,
    }),
    callsAndContacts: types.model({
      calls: types.array(
        types.model({
          date: types.string,
          number: types.string,
          duration: types.string,
          type: types.string,
        })
      ),
      contacts: types.array(
        types.model({
          number: types.string,
          name: types.string,
        })
      ),
    }),
  })
  .actions((self) => ({
    addNumber(call: CallStoreProps) {
      self.callsAndContacts.calls.push(call);
    },
    clearCallLog() {
      self.callsAndContacts.calls.clear();
    },
    addContact(contact: ContactProps) {
      self.callsAndContacts.contacts.push(contact);
    },
    deleteContact(contact: ContactProps) {
      const targetStoreContact = self.callsAndContacts.contacts.find(
        (storeContact) => storeContact === contact
      );
      if (targetStoreContact) {
        const index = self.callsAndContacts.contacts.indexOf(targetStoreContact);
        self.callsAndContacts.contacts.splice(index, 1);
      }
    },
    updateStateData(stateData: IStateData) {
      self.stateData = stateData;
    },
    updateSipData(sipData: SipDataProps) {
      self.sipData = sipData;
    },
    setCallsAndContacts(data: string | null) {
      if (data) self.callsAndContacts = JSON.parse(data);
    },
  }));

export const store = storeModel.create({
  callsAndContacts: {
    calls: JSON.parse(localStorage.getItem('calls') || '[]'),
    contacts: JSON.parse(localStorage.getItem('contacts') || '[]'),
  },
  stateData: {
    currentPage: 'login',
    auth: false,
    isAuthError: false,
    isIncomingCall: false,
    isCalling: false,
    number: '',
    isStopWatchRunning: false,
    callStatus: 'Disconnected',
    callDuration: '00:00:00',
    callPossibility: false,
  },
  sipData: {
    server: '',
    login: '',
    password: '',
    port: '',
  },
});
