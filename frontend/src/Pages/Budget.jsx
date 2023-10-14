import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const { userData, setUserData  } = useContext(UserContext);
  const [budgets, setBudgets] = useState([]);
  const [budgetEntries, setBudgetEntries] = useState([]);
  const [selectedBudgetEntry, setSelectedBudgetEntry] = useState(null);
  const navigate = useNavigate();
  const ref = useRef(null);
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [isModifyEntry, setIsModifyEntry] = useState(false);
  const [date, setDate] = useState('');
  const [recurrence, setRecurrence] = useState('');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');

  const handleViewClick = () => {
    navigate('/Main');
  };

  const handleNewEntry = () => {
    setAmount("");
    setName("");
    setDate("");
    setRecurrence("");
    setIsNewEntry(true);
  };

  const handleModifyEntry = () => {
    if(selectedBudgetEntry === null) return;
    setAmount(selectedBudgetEntry.amount);
    setName(selectedBudgetEntry.name);
    setDate(selectedBudgetEntry.date);
    setRecurrence(selectedBudgetEntry.recurrence);
    setIsModifyEntry(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/budgetentry/delete/"+selectedBudgetEntry.id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: null,
      });
  
      if (response.ok)  {
        setBudgetEntries(prevBudgetEntries => prevBudgetEntries.filter(entry => entry.id !== selectedBudgetEntry.id));
      }else {
        console.error("delete failed");
      }
    } catch (error) {
      console.error("There was a problem with the delete request", error);
    }
  };

  const handleNewModifyEntrySubmit = async () => {
    let attemptData;
  
    if (isModifyEntry) {
      attemptData = {
        budget_id: selectedBudgetEntry.id,
        budget: budgets.id,
        amount: amount,
        name: name,
      };
    } else {
      attemptData = {
        budget_id: budgets.id,
        amount: amount,
        name: name,
      };
    }
  
    try {
      let response;
  
      if (isNewEntry) {
        response = await fetch("http://127.0.0.1:8000/budgetentry/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attemptData),
        });
      } else {
        response = await fetch("http://127.0.0.1:8000/budgetentry/update/" + selectedBudgetEntry.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attemptData),
        });
      }
  
      if (response.ok && isNewEntry) {
        console.log("BudgetEntry created successfully.");
        const createdBudgetEntry = await response.json();
        setBudgetEntries((prevBudgetEntries) => [...prevBudgetEntries, createdBudgetEntry]);
      } else if (isModifyEntry) {
        console.log("BudgetEntry updated successfully.");
        const updatedBudgetEntry = await response.json();
        setBudgetEntries((prevBudgetEntries) =>
          prevBudgetEntries.map((entry) => (entry.id === updatedBudgetEntry.id ? updatedBudgetEntry : entry))
        );
      } else {
        console.error("BudgetEntry creation/update failed");
      }
    } catch (error) {
      console.error("There was a problem with the request", error);
    }

    setIsNewEntry(false);
    setIsModifyEntry(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleRecurrenceChange = (event) => {
    setRecurrence(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
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

        <div className="p-6 bg-gradient-to-br from-white to-green-100 border border-blue-200 p-6 rounded-lg shadow-2xl transform transition-transform duration-300">
        {isNewEntry || isModifyEntry ?(
          <div className='border border-black p-6'>
            <h2 className="text-xl font-semibold mb-4">
              {isNewEntry ? 'New Entry' : (isModifyEntry ? 'Modify Entry' : '')}
            </h2>
            <input type="text" placeholder="Name" className="mb-2 w-full p-2 rounded" value={name} onChange={handleNameChange} />
            <input type="text" placeholder="Date" className="mb-2 w-full p-2 rounded" value={date} onChange={handleDateChange} />
            <input type="text" placeholder="Recurrence" className="mb-2 w-full p-2 rounded" value={recurrence} onChange={handleRecurrenceChange} />
            <input type="text" placeholder="Amount" className="mb-2 w-full p-2 rounded" value={amount} onChange={handleAmountChange} />
            <button className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 w-24 h-10" onClick={handleNewModifyEntrySubmit}>Submit</button>
          </div>
        ) : null}


        <div className='border border-black p-6'>
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <button className="bg-blue-500 text-white p-2 rounded mr-2 hover-bg-blue-600 w-24 h-10" onClick={handleNewEntry}>New</button>
          <button className="bg-yellow-500 text-white p-2 rounded mr-2 hover-bg-yellow-600 w-24 h-10" onClick={handleModifyEntry}>Edit</button>
          <button className="bg-red-500 text-white p-2 rounded mr-2 hover-bg-red-600 w-24 h-10" onClick={handleDelete}>Delete</button>
          <button className="bg-green-500 text-white p-2 rounded mr-2 hover-bg-green-600 w-24 h-10" onClick={handleViewClick}>View</button>
        </div>
      </div>

      </div>
    </div>
  );
};

export default App;
