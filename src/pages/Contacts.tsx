import { store } from '../store/store.ts';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { ContactProps, SoundProps } from '../lib/interfaces.ts';
import { sortContacts } from '../lib/utils/sortContacts.ts';
import { playButtonsSound } from '../lib/utils/sound.ts';
import NewContactMenu from '../components/Contacts/NewContactMenu.tsx';
import ContactsList from '../components/Contacts/ContactsList.tsx';

const Contacts = observer(({ buttonsSoundRef }: SoundProps) => {
  const sortedContacts: ContactProps[] = sortContacts();
  const [isNewContactMenuActive, setIsNewContactMenuActive] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    store.updateStateData({ ...store.stateData, callPossibility: true });
    if (store.stateData.number) {
      setIsNewContactMenuActive(true);
      setNumber(store.stateData.number);
    }
  }, []);

  const saveContact = () => {
    playButtonsSound(buttonsSoundRef);
    store.addContact({ name, number });
    localStorage.setItem(store.sipData.login, JSON.stringify(store.callsAndContacts));
    cancel();
  };

  const cancel = () => {
    playButtonsSound(buttonsSoundRef);
    setNumber('');
    setName('');
    setIsNewContactMenuActive(false);
  };

  function deleteContact(contact: ContactProps, e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    playButtonsSound(buttonsSoundRef);
    store.deleteContact(contact);
    localStorage.setItem(store.sipData.login, JSON.stringify(store.callsAndContacts));
  }

  function call(number: string) {
    playButtonsSound(buttonsSoundRef);
    store.updateStateData({ ...store.stateData, number, currentPage: 'phone' });
  }

  return (
    <>
      <h1 className={'menu-title'}>Contacts</h1>
      {isNewContactMenuActive ? (
        <NewContactMenu
          saveContact={saveContact}
          number={number}
          setNumber={setNumber}
          cancel={cancel}
          setName={setName}
          name={name}
        />
      ) : (
        <>
          <ContactsList call={call} sortedContacts={sortedContacts} deleteContact={deleteContact} />
          <button
            onClick={() => {
              playButtonsSound(buttonsSoundRef);
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
