import {PagesProps} from "../lib/interfaces.ts";

const Menu = ({setCurrentPage, ua}: PagesProps) => {
  return (
    <div className={'display'}>
      <h1 className={'menu-title'}>Main menu</h1>
      <div className={'menu-container'}>
        <div onClick={() => setCurrentPage('call-log')} className={'menu-item'}>
          <div className={'menu-icon call-log'}></div>
          <p className={'menu-description'}>Call log</p>
        </div>
        <div onClick={() => setCurrentPage('contacts')} className={'menu-item'}>
          <div className={'menu-icon contacts'}></div>
          <p className={'menu-description'}>Contacts</p>
        </div>
        <div onClick={() => ua?.unregister({all: true})} className={'menu-item'}>
          <div className={'menu-icon logout'}></div>
          <p className={'menu-description'}>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
