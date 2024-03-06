import { Flex } from 'antd';
import { ContactsListProps } from '../../lib/interfaces.ts';

const ContactsList = ({call, sortedContacts, deleteContact}: ContactsListProps) => {
  return (
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
  );
};

export default ContactsList;
