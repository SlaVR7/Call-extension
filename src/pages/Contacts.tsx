import {Button, Flex, Input} from "antd";
import {store} from "../store/store.ts";
import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {ContactProps} from "../lib/interfaces.ts";

const Contacts = observer(() => {
  const contacts = store.contacts;
  const [isNewContactMenuActive, setIsNewContactMenuActive] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    if (store.stateData.number) {
      setIsNewContactMenuActive(true);
      setNumber(store.stateData.number);
    }
  }, [])

  const addContact = () => {
    store.addContact({name, number});
    cancel();
  }

  const cancel = () => {
    setNumber('');
    setName('');
    setIsNewContactMenuActive(false)
  }

  function deleteContact(contact: ContactProps, e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    store.deleteContact(contact);
  }

  function call(number: string) {
    store.updateStateData({...store.stateData, number})
    store.updateStateData({...store.stateData, currentPage: 'phone'});
  }

  return (
    <div className={'display'}>
      <h1 className={'menu-title'}>Contacts</h1>
      <button
        onClick={() => setIsNewContactMenuActive(prevState => !prevState)}
        className={'new-contact-button'}>
        {isNewContactMenuActive ? 'Contacts' : 'Add new contact'}
      </button>
      {isNewContactMenuActive ? (
        <form className={'new-contact-form'} onSubmit={addContact}>
          <label htmlFor="name">Name:</label>
          <Input id="name"
                 className={'new-contact-input'}
                 value={name}
                 onChange={(e) => {
                  setName(e.target.value);
              } } />
          <label htmlFor="number">Number:</label>
          <Input id="number"
                 className={'new-contact-input'}
                 value={number}
                 onChange={(e) => {
                   if (!isNaN(+e.target.value)) setNumber(e.target.value);
                 }}
          />
          <Flex justify={"space-around"}>
            <Button onClick={addContact} type="primary">Add</Button>
            <Button onClick={cancel}>Cancel</Button>
          </Flex>
        </form>
      ) : (
        <ul className={'calls-list'}>
          {contacts.map((contact, index) => {
            return (
              <li onClick={() => call(contact.number)} key={index} className={'calls-item'}>
                <div className={`calls-icon contact-icon`}></div>
                <Flex vertical align={"end"}>
                  <p className={'calls-name'}>{contact.name}</p>
                  <p className={'calls-number'}>{contact.number}</p>
                  <div>
                    <button className={'contact-button'}>Call</button>
                    <button onClick={(e) => deleteContact(contact, e)} className={'contact-button'}>Delete</button>
                  </div>
                </Flex>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  );
});

export default Contacts;
