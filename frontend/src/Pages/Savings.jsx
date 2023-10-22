import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';

const App = () => {
  const { userData } = useContext(UserContext);
  const [budgets, setBudgets] = useState([]);
  const [yearlyIncome, setYearlyIncome] = useState('');
  const [yearlyIncomeDiff, setYearlyIncomeDiff] = useState(null);
  const [totalYearlyCost, setTotalYearlyCost] = useState(null);
  const [yearlyTableData, setYearlyTableData] = useState([]);

  const [dataUpdated, setdataUpdated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firstResponse = await fetch(`http://18.189.150.72:8000/budget/findbyid/${userData.id}/`, {
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


const calculateYearlyTableData = () => {
  let totalNetWorth = 0; // Initialize totalNetWorth to 0
  const yearlyTableData = Array.from({ length: 20 }, (_, year) => {
    const yearlyIncome = yearlyIncomeDiff + totalNetWorth * (budgets.effectiveInterestRate / 100);
    const interest = totalNetWorth * (budgets.effectiveInterestRate / 100);

    totalNetWorth = totalNetWorth + yearlyIncome - totalNetWorth * (budgets.effectiveInterestRate / 100);

    return {
      year: year + 1,
      totalNetWorth,
      yearlyIncome: yearlyIncome.toFixed(2),
      interest: interest.toFixed(2),
    };
  });
  setYearlyTableData(yearlyTableData);
};

useEffect(() => {
  calculateYearlyTableData();
}, [budgets.effectiveInterestRate, yearlyIncomeDiff, budgets.yearlyIncome]);


  const calculateTotalYearlyCost = (monthlyPayment) => {
    if (monthlyPayment !== null) {
      const yearlyCost = parseFloat(monthlyPayment) * 12;
      setTotalYearlyCost(yearlyCost);
    }
  };

  const calculateYearlyIncomeDiff = (monthlyPayment) => {
    const diff = parseFloat(yearlyIncome) - parseFloat(monthlyPayment) * 12;
    setYearlyIncomeDiff(diff);
  };

  const updateYearlyIncome = async () => {
    setdataUpdated(true);
    try {
      const attemptData = {
        id: budgets.id,
        user: budgets.user,
        budgetname: budgets.budgetname,
        yearlyIncome: yearlyIncome,
        monthlyPayment: budgets.monthlyPayment,
        effectiveInterestRate: budgets.effectiveInterestRate,
      }
      const response = await fetch(`http://18.189.150.72:8000/budget/update/${userData.id}/`, {
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
          <div className="text-center">
            <p><span className="font-bold">Yearly Income:</span> {budgets.yearlyIncome}</p>
            <p><span className="font-bold">Effective Interest Rate:</span> {budgets.effectiveInterestRate}</p>
            <p><span className="font-bold">Budget Monthly Payment:</span> {budgets.monthlyPayment}</p>
            <p><span className="font-bold">Budget Yearly Cost:</span> {totalYearlyCost}</p>
            <p>
              <span className="font-bold">Your Yearly Income including Cost:</span> {yearlyIncomeDiff}
            </p>
            <p className="font-bold text-xl text-red-500">Click Update to view Table!</p>
            <label htmlFor="yearlyIncome" className="font-bold border border-black">Yearly Income:</label>
            <input className="border border-black"
              type="text"
              id="yearlyIncome"
              placeholder="Enter your yearly income"
              value={yearlyIncome}
              onChange={(e) => setYearlyIncome(e.target.value)}
            />
            <button className="border border-black" onClick={updateYearlyIncome}>Update Yearly Income</button>
          </div>

          {dataUpdated && (
          <div>
            <table className="min-w-full divide-y divide-green-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-green-100 text-left text-xs leading-4 font-medium text-green-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 bg-green-100 text-left text-xs leading-4 font-medium text-green-500 uppercase tracking-wider">
                    Yearly Income
                  </th>
                  <th className="px-6 py-3 bg-green-100 text-left text-xs leading-4 font-medium text-green-500 uppercase tracking-wider">
                    Total Net Worth
                  </th>
                  <th className="px-6 py-3 bg-green-100 text-left text-xs leading-4 font-medium text-green-500 uppercase tracking-wider">
                    Interest
                  </th>
                </tr>
              </thead>
              <tbody>
                {yearlyTableData.map((data) => (
                  <tr className="border border-green-500" key={data.year}>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                      {data.year}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                      {data.yearlyIncome}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                      {data.totalNetWorth}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                      {data.interest}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}


        </div>
      ) : (
        <p>
          <a href="/budgets">Please go to the budgets page to set up your budget.</a>
        </p>
      )}
    </div>
  );
};

export default App;
