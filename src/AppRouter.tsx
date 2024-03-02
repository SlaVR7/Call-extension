import * as React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Phone from "./pages/Phone.tsx";
import CallLog from "./pages/CallLog.tsx";
import Menu from "./pages/Menu.tsx";
import App from "./App.tsx";

const AppRouter: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <>
          <Route index element={<Phone />} />
          <Route path={'/menu'} element={<Menu />} />
          <Route path={'/call-log'} element={<CallLog />} />
        </>
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
