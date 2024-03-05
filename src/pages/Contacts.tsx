import { Button, Flex, Input } from 'antd';
import { store } from '../store/store.ts';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { ContactProps, SoundProps } from '../lib/interfaces.ts';
import { sortContacts } from '../lib/utils/sortContacts.ts';

const Contacts = observer(({ playButtonsSound }: SoundProps) => {
  const sortedContacts: ContactProps[] = sortContacts();
  const [isNewContactMenuActive, setIsNewContactMenuActive] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    if (store.stateData.number) {
      setIsNewContactMenuActive(true);
      setNumber(store.stateData.number);
    }
  }, []);

  const addContact = () => {
    playButtonsSound();
    store.addContact({ name, number });
    localStorage.setItem(store.sipData.login, JSON.stringify(store.callsAndContacts));
    cancel();
  };

  const cancel = () => {
    playButtonsSound();
    setNumber('');
    setName('');
    setIsNewContactMenuActive(false);
  };

  function deleteContact(contact: ContactProps, e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    playButtonsSound();
    store.deleteContact(contact);
    localStorage.setItem(store.sipData.login, JSON.stringify(store.callsAndContacts));
  }

  function call(number: string) {
    playButtonsSound();
    store.updateStateData({ ...store.stateData, number });
    store.updateStateData({ ...store.stateData, currentPage: 'phone' });
  }

  return (
    <>
      <h1 className={'menu-title'}>Contacts</h1>
      {isNewContactMenuActive ? (
        <form className={'new-contact-form'} onSubmit={addContact}>
          <label htmlFor="name">Name:</label>
          <Input
            id="name"
            className={'new-contact-input'}
            value={name}
            onChange={(e) => {
              if (name.length < 20) setName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && name.length === 20) {
                setName((prevValue) => prevValue.slice(0, 19));
                e.preventDefault();
              }
            }}
          />
          <label htmlFor="number">Number:</label>
          <Input
            id="number"
            className={'new-contact-input'}
            value={number}
            onChange={(e) => {
              console.log('onChanfe');
              if (!isNaN(+e.target.value) && number.length < 14) setNumber(e.target.value);
            }}
            onKeyDown={(e) => {
              console.log('onKetDown');
              if (e.key === 'Backspace' && number.length === 14) {
                setNumber((prevValue) => prevValue.slice(0, 13));
                e.preventDefault();
              }
            }}
          />
          <Flex justify={'space-around'}>
            <Button onClick={addContact} type="primary">
              Add
            </Button>
            <Button onClick={cancel}>Cancel</Button>
          </Flex>
        </form>
      ) : (
        <>
          <ul className={'calls-list'}>
            {sortedContacts.map((contact, index) => {
              return (
                <li onClick={() => call(contact.number)} key={index} className={'calls-item'}>
                  <div className={`calls-icon contact-icon`}></div>
                  <Flex vertical align={'end'} gap={5}>
                    <p className={'calls-name'}>{contact.name}</p>
                    <p className={'calls-number'}>{contact.number}</p>
                    <div>
                      <button className={'contact-button'}>Call</button>
                      <button
                        onClick={(e) => deleteContact(contact, e)}
                        className={'contact-button'}
                      >
                        Delete
                      </button>
                    </div>
                  </Flex>
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => {
              playButtonsSound();
              setIsNewContactMenuActive((prevState) => !prevState);
            }}
            className={'new-contact-button'}
          >
            Add new contact
          </button>
        </>
      )}
    </>
  );
});

export default Contacts;
