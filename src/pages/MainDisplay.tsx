import { store } from '../store/store.ts';
import { MainDisplayProps } from '../lib/interfaces.ts';
import { playButtonsSound } from '../lib/utils/sound.ts';
import { useEffect } from 'react';

const MainDisplay = ({ ua, buttonsSoundRef }: MainDisplayProps) => {
  useEffect(() => {
    store.updateStateData({ ...store.stateData, callPossibility: false });
  }, []);

  const changeCurrentPage = (page: string) => {
    playButtonsSound(buttonsSoundRef);
    store.updateStateData({ ...store.stateData, currentPage: page });
  };

  const logout = () => {
    store.updateStateData({...store.stateData, callStatus: 'Disconnected'});
    playButtonsSound(buttonsSoundRef);
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
