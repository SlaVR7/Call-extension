import {useNavigate} from "react-router-dom";

const Menu = () => {
const navigate = useNavigate();
  return (
    <div className={'display'}>
      <h1 className={'menu-title'}>Main menu</h1>
      <div className={'menu-container'}>
        <div onClick={() => navigate('/call-log')} className={'menu-item'}>
          <div className={'menu-icon call-log'}></div>
          <p className={'menu-description'}>Call log</p>
        </div>

      </div>
    </div>
  );
};

export default Menu;
