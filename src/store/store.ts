import {types} from "mobx-state-tree";
import {CallStoreProps, ContactProps} from "../lib/interfaces.ts";

const storeModel = types.model({
  calls: types.array(types.model({
    number: types.string,
    duration: types.string,
    type: types.string,
  })),
  contacts: types.array(types.model({
    number: types.string,
    name: types.string,
  }))
}).actions((self) => ({
  addNumber(call: CallStoreProps) {
    self.calls.push(call);
  },
  addContact(contact: ContactProps) {
    self.contacts.push(contact);
  },
  deleteContact(contact: ContactProps) {
    const targetStoreContact = self.contacts.find(storeContact => storeContact === contact);
    if (targetStoreContact) {
      const index = self.contacts.indexOf(targetStoreContact);
      self.contacts.splice(index, 1);
    }
  }
}));

export const store = storeModel.create({
  calls: [],
  contacts: [],
})
