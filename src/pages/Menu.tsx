import {PagesProps} from "../lib/interfaces.ts";
import {store} from "../store/store.ts";

const Menu = ({ua}: PagesProps) => {
  return (
    <div className={'display'}>
      <h1 className={'menu-title'}>Main menu</h1>
      <div className={'menu-container'}>
        <div onClick={() => store.updateStateData({...store.stateData, currentPage: 'call-log'})} className={'menu-item'}>
          <div className={'menu-icon call-log'}></div>
          <p className={'menu-description'}>Call log</p>
        </div>
        <div onClick={() => store.updateStateData({...store.stateData, currentPage: 'contacts'})} className={'menu-item'}>
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
