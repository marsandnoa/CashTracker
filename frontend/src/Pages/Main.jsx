import React, { useContext } from 'react';
import { UserContext } from '../UserContext';

const Main = () => {
  const { userData } = useContext(UserContext);

  return (
    <div className='flex flex-col items-center h-screen'>
      <div className='text-4xl font-bold text-blue-900 mb-4'>
        Welcome, {userData.fullname}!
      </div>
      <div className='max-w-md text-center'>
        <p className="text-xl">
          This application helps you manage your everyday financial information.
          First visit the Budget page to enter your monthly income and expenses.
          Secondly, visit the interest page to enter the interest rates/allocation of your assets,
          Thirdly, visit the savings page to enter your income and view networth projections
        </p>
      </div>
    </div>
  );
};

export default Main;
