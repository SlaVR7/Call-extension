import {types} from "mobx-state-tree";

const CallHistory = types.model({
  numbers: types.array(types.string),
}).actions((self) => ({
  addNumber(callNumber: string) {
    self.numbers.push(callNumber);
  },
}));

export const store = CallHistory.create({
  numbers: [],
})
