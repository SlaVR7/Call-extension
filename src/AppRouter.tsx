import * as React from 'react';
import {
  Route, RouterProvider, createRoutesFromElements, createBrowserRouter,

} from 'react-router-dom';
import App from "./App.tsx";
import CallLog from "./pages/CallLog.tsx";
import Phone from "./pages/Phone.tsx";
import Menu from "./pages/Menu.tsx";
import Contacts from "./pages/Contacts.tsx";

const AppRouter: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <>
          <Route index element={<Phone />} />
          <Route path={'/menu'} element={<Menu />} />
          <Route path={'/call-log'} element={<CallLog />} />
          <Route path={'/contacts'} element={<Contacts />} />
        </>
        <Route path={'*'} element={<Phone />} />
      </Route>
    )
  );

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

export default AppRouter;
