import { Button, Flex, Input } from 'antd';
import { NewContactMenuProps } from '../../lib/interfaces.ts';

const NewContactMenu = ({name, saveContact, setName, number, setNumber, cancel}: NewContactMenuProps) => {
  return (
    <form className={'new-contact-form'} onSubmit={saveContact}>
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
        <Button onClick={saveContact} type="primary">
          Add
        </Button>
        <Button onClick={cancel}>Cancel</Button>
      </Flex>
    </form>
  );
};

export default NewContactMenu;
