import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';

const App = () => {
  const { userData } = useContext(UserContext);
  const [budgets, setBudgets] = useState([]);
  const [yearlyIncome, setYearlyIncome] = useState('');
  const [yearlyIncomeDiff, setYearlyIncomeDiff] = useState(null);
  const [totalYearlyCost, setTotalYearlyCost] = useState(null);

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
          setYearlyIncome(firstData.yearlyIncome);
          calculateTotalYearlyCost(firstData.monthlyPayment);
          calculateYearlyIncomeDiff(firstData.monthlyPayment);
        } else {
          console.error('Failed to fetch budgets');
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };
    fetchData();
  }, [userData.id]);

  const calculateTotalYearlyCost = (monthlyPayment) => {
    if (monthlyPayment !== null) {
      const yearlyCost = parseFloat(monthlyPayment) * 12;
      setTotalYearlyCost(yearlyCost);
    }
  };

  const calculateYearlyIncomeDiff = (monthlyPayment) => {
    console.log("Calculating yearly income difference...");
    console.log("Yearly income:", yearlyIncome);
    console.log("Monthly payment:", monthlyPayment);
    const diff = parseFloat(budgets.yearlyIncome) - monthlyPayment * 12;
    setYearlyIncomeDiff(diff);
  };

  const updateYearlyIncome = async () => {
    try {
      const attemptData = {
        id: budgets.id,
        user: budgets.user,
        budgetname: budgets.budgetname,
        yearlyIncome: yearlyIncome,
        monthlyPayment: budgets.monthlyPayment,
        effectiveInterestRate: budgets.effectiveInterestRate,
      }
      const response = await fetch(`http://127.0.0.1:8000/budget/update/${userData.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attemptData)
      });

      if (response.ok) {
        console.log("Yearly income updated successfully.");
        budgets.yearlyIncome = yearlyIncome; 
        calculateYearlyIncomeDiff(budgets.monthlyPayment); 
      } else {
        console.error("Failed to update yearly income");
      }
    } catch (error) {
      console.error("Error updating yearly income:", error);
    }
  };

  return (
    <div>
      {budgets ? (
        <div>
          <h1 className="text-3xl font-bold text-green-500 py-4 border-b-2 border-green-500">
            Budget for {userData.fullname}
          </h1>
          <div>
            <p>Yearly Income: {budgets.yearlyIncome}</p>
            <p>Budget Monthly Payment: {budgets.monthlyPayment}</p>
            <p>Budget Yearly Cost: {totalYearlyCost}</p>
          </div>
          <div>
            <p>
              Your Yearly Income - (Budget Monthly Payment * 12) = {yearlyIncomeDiff}
            </p>
          </div>
        </div>
      ) : (
        <p>
          <a href="/budgets">Please go to the budgets page to set up your budget.</a>
        </p>
      )}

      <div>
        <label htmlFor="yearlyIncome">Yearly Income:</label>
        <input
          type="text"
          id="yearlyIncome"
          placeholder="Enter your yearly income"
          value={yearlyIncome}
          onChange={(e) => setYearlyIncome(e.target.value)}
        />
        <button onClick={updateYearlyIncome}>Update Yearly Income</button>
      </div>
    </div>
  );
};

export default App;
