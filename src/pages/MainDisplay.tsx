import { store } from '../store/store.ts';
import { MainDisplayProps } from '../lib/interfaces.ts';

const MainDisplay = ({ ua, playButtonsSound }: MainDisplayProps) => {
  const changeCurrentPage = (page: string) => {
    playButtonsSound();
    store.updateStateData({ ...store.stateData, currentPage: page });
  };

  const logout = () => {
    playButtonsSound();
    ua?.unregister({ all: true });
  };

  return (
    <div className={'main-display-container'}>
      <div onClick={() => changeCurrentPage('phone')} className={'menu-item'}>
        <div className={'menu-icon small-icon ring-button'}></div>
        <p className={'menu-description small-description'}>Call</p>
      </div>
      <div onClick={() => changeCurrentPage('call-log')} className={'menu-item'}>
        <div className={'menu-icon small-icon call-log'}></div>
        <p className={'menu-description small-description'}>Call log</p>
      </div>
      <div onClick={() => changeCurrentPage('contacts')} className={'menu-item'}>
        <div className={'menu-icon small-icon contacts'}></div>
        <p className={'menu-description small-description'}>Contacts</p>
      </div>
      <div onClick={logout} className={'menu-item'}>
        <div className={'menu-icon small-icon logout'}></div>
        <p className={'menu-description small-description'}>Logout</p>
      </div>
    </div>
  );
};

export default MainDisplay;
