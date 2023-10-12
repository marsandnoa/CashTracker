import React, { useContext } from 'react';
import { UserContext } from '../UserContext'; 

const Main = () => {
  const { userData } = useContext(UserContext);  

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='text-4xl font-bold text-blue-900'>
        Main Page
      </div>
      <div>
        {userData && (
          <div>
            <h2>User Data:</h2>
            <p>Name: {userData.fullname}</p>
            <p>Email: {userData.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
