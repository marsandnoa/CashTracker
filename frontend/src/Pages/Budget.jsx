import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const { userData } = useContext(UserContext);
  const [budgets, setBudgets] = useState([]);
  const [budgetEntries, setBudgetEntries] = useState([]);
  const [selectedBudgetEntry, setSelectedBudgetEntry] = useState(null);
  const navigate = useNavigate();
  const ref = useRef(null);

  const handleViewClick = () => {
    navigate('/Main');
  };

  const handleBudgetEntryClick = (entry) => {
    setSelectedBudgetEntry(prevSelected => prevSelected === entry ? null : entry);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firstResponse = await fetch(`http://127.0.0.1:8000/budget/findbyid/${userData.id}/`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          }
        });

        if (firstResponse.ok) {
          const firstData = await firstResponse.json();
          setBudgets(firstData);

          try {
            const secondResponse = await fetch(`http://127.0.0.1:8000/budgetentry/findbybudgetid/${firstData.id}/`, {
              method: "GET",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('authToken')}`
              }
            });

            if (secondResponse.ok) {
              const secondData = await secondResponse.json();
              setBudgetEntries(secondData);
            } else {
              console.error('Failed to fetch budget entries');
            }
          } catch (error) {
            console.error('Error fetching budget entries:', error);
          }
        } else {
          console.error('Failed to fetch budgets');
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };
    fetchData();
  }, [userData.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setSelectedBudgetEntry(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {budgets ? (
        <div>
          <h1 className="text-3xl font-bold text-green-500 py-4 border-b-2 border-green-500">
            Budget for {userData.fullname}
          </h1>
        </div>
      ) : (
        <p>Loading budget...</p>
      )}

      <div className="flex flex-row justify-between mb-2 p-2 font-bold">
      <div className="flex-1 border p-2">
        <p className="text-center">Bill</p>
      </div>
      <div className="flex-1 border p-2">
        <p className="text-center">Date</p>
      </div>
      <div className="flex-1 border p-2">
        <p className="text-center">Recurrence</p>
      </div>
      <div className="flex-1 border p-2">
        <p className="text-center">Amount</p>
      </div>
    </div>

      <div ref={ref} className="flex-1 bg-gradient-to-br from-white border-blue-200 p-6 rounded-lg shadow-2xl transform transition-transform duration-300">
        {budgetEntries.map(entry => (
          <div
            key={entry.id}
            className={`flex flex-row justify-between mb-2 p-2 cursor-pointer ${selectedBudgetEntry === entry ? 'bg-blue-100' : 'bg-white'} hover:bg-blue-100`}
            onClick={() => handleBudgetEntryClick(entry)}
          >
            <div className="flex-1 border p-2">
              <p className="text-center">{entry.name}</p>
            </div>
            <div className="flex-1 border p-2">
              <p className="text-center">{entry.date}</p>
            </div>
            <div className="flex-1 border p-2">
              <p className="text-center">{entry.recurrence}</p>
            </div>
            <div className="flex-1 border p-2">
              <p className="text-center">{entry.amount}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-br from-white to-green-100 border border-blue-200 p-6 rounded-lg shadow-2xl transform transition-transform duration-300">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <button className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 w-24 h-10">New</button>
        <button className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600 w-24 h-10">Edit</button>
        <button className="bg-red-500 text-white p-2 rounded mr-2 hover:bg-red-600 w-24 h-10">Delete</button>
        <button className="bg-green-500 text-white p-2 rounded mr-2 hover:bg-green-600 w-24 h-10" onClick={handleViewClick}>View</button>
      </div>
    </div>
  );
};

export default App;
