import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';

const App = () => {
  const { userData } = useContext(UserContext);
  const [budgets, setBudgets] = useState([]);
  const [inputItems, setInputItems] = useState([]);
  const [effectiveInterestRate, setEffectiveInterestRate] = useState(0);

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
        } else {
          console.error('Failed to fetch budgets');
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };
    fetchData();
  }, [userData.id]);

  const updateEffectiveInterestRate = async (rate) => {
    try {
      const attemptData = {
        id: budgets.id,
        user: budgets.user,
        budgetname: budgets.budgetname,
        yearlyIncome: budgets.yearlyIncome,
        monthlyPayment: budgets.monthlyPayment,
        effectiveInterestRate: effectiveInterestRate,
      };
      console.log(attemptData);
      const response = await fetch(`http://127.0.0.1:8000/budget/update/${userData.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attemptData)
      });

      if (response.ok) {
        console.log("Effective interest rate updated successfully.");
        budgets.effectiveInterestRate = rate;
      } else {
        console.error("Failed to update effective interest rate");
      }
    } catch (error) {
      console.error("Error updating effective interest rate:", error);
    }
  };


  const handleInputItemChange = (index, name, value) => {
    const updatedInputItems = [...inputItems];
    updatedInputItems[index] = { name, value };
    setInputItems(updatedInputItems);
  };

  useEffect(() => {
    const interestRates = {
      stocks: 7,
      bonds: 5,
      savings: 3,
      cash: 0,
    };

    const totalInterestRate = inputItems.reduce((sum, item) => {
      const interestRate = parseFloat(item.value);
      const weight = parseFloat(interestRates[item.name]);
      return sum + (interestRate * weight);
    }, 0);

    const totalValue = inputItems.reduce((sum, item) => {
      const interestRate = parseFloat(item.value);
      return sum + interestRate;
    }, 0);

    const effectiveRate = totalInterestRate/totalValue;
    setEffectiveInterestRate(effectiveRate);
    console.log("Effective interest rate:", effectiveInterestRate);

    // Update budgets with the effective interest rate
    if (budgets.id && effectiveRate !== budgets.effectiveInterestRate) {
      setEffectiveInterestRate(effectiveRate);
    }
  }, [inputItems, budgets.id, budgets.effectiveInterestRate, setEffectiveInterestRate]);


  const renderInputItems = () => {
    const items = ["stocks", "bonds", "savings","cash"];
    const interestRates = {
      stocks: "7%",
      bonds: "5%",
      savings: "3%",
      cash: "0%",
    };
  
    return items.map((item, index) => (
      <div key={index} className="mb-3 border border-green-500">
        <label htmlFor={`inputItem-${index}`} className="font-bold">
          {item.charAt(0).toUpperCase() + item.slice(1)} Interest Rate ({interestRates[item]}):
        </label>
        <input
          type="number"
          id={`inputItem-${index}`}
          placeholder={`Enter ${item} interest rate`}
          value={inputItems[index] ? inputItems[index].value : ''}
          onChange={(e) => handleInputItemChange(index, item, e.target.value)}
        />
      </div>
    ));
  };
  
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-green-500 py-4 border-b-2 border-green-500">
        Interest Rate
      </h1>
      <div className="flex flex-col justify-center items-center text-center">
      <h1 className="text-3xl font-bold text-green-500 py-4 border-b-2 border-green-500">
        {userData.fullname} Interest Rate
      </h1>
        <div className="mb-4">
          <p>Type in the percentage of your money that you want to put into each asset class</p>
          <p>You can also type in the ratio that you want to put into each grouping, e.g, 2$ in bonds for every 1$ in stocks</p>
          <p>This calculates the effective interest rate to apply to your total savings</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">Effective Interest Rate: {effectiveInterestRate}%</p>
          {renderInputItems()}
          <button onClick={() => updateEffectiveInterestRate()} className="mt-4 border border-black">Click to update Interest Rate</button>
        </div>
      </div>
    </div>
  );
  
};

export default App;
