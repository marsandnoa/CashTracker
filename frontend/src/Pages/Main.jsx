import React, { useContext } from 'react';
import { UserContext } from '../UserContext';

const Main = () => {
  const { userData } = useContext(UserContext);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='text-4xl font-bold text-blue-900 mb-4'>
        Welcome, {userData.fullname}!
      </div>
      <div className='max-w-md text-center'>
        <p>
          This application helps you manage your everyday financial information.
          Use the navigation bar at the top to explore and manage your budgets and expenses.
        </p>
      </div>
    </div>
  );
};

export default Main;
