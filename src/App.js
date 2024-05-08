import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AverageCalculator = () => {
  const [numbersBefore, setNumbersBefore] = useState([]);
  const [numbersAfter, setNumbersAfter] = useState([]);
  const [average, setAverage] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const windowSize = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://third-party-api/numbers');
      const numbers = response.data.numbers;

      if (numbers.length > 0) {
        updateNumbersBefore(numbers);
        calculateAverage(numbers);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateNumbersBefore = (numbers) => {
    setNumbersBefore(numbers.slice(0, windowSize));
  };

  const updateNumbersAfter = (latestNumber) => {
    const newNumbers = [...numbersAfter, latestNumber];
    setNumbersAfter(newNumbers.slice(-windowSize));
    if (newNumbers.length >= windowSize) {
      calculateAverage(newNumbers.slice(-windowSize));
    }
  };

  const calculateAverage = (numbers) => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    setAverage(sum / numbers.length);
  };

  const handleFetchData = async () => {
    try {
      const response = await axios.get('http://your-api/numbers/numberid');
      const latestNumber = response.data.latestNumber;
      updateNumbersAfter(latestNumber);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddNumber = () => {
    const number = parseFloat(inputValue);
    if (!isNaN(number)) {
      updateNumbersAfter(number);
      setInputValue('');
    }
  };

  return (
    <div>
      <h1>Average Calculator</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a number"
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handleAddNumber} style={{ padding: '5px 10px', background: 'green', color: 'white', border: 'none' }}>
          Add Number
        </button>
      </div>
      <button onClick={handleFetchData} style={{ padding: '5px 10px', background: 'blue', color: 'white', border: 'none' }}>
        Fetch Data
      </button>
      <h2>Numbers Before:</h2>
      <ul>
        {numbersBefore.map((number, index) => (
          <li key={index}>{number}</li>
        ))}
      </ul>
      <h2>Numbers After:</h2>
      <ul>
        {numbersAfter.map((number, index) => (
          <li key={index}>{number}</li>
        ))}
      </ul>
      <h2>Average:</h2>
      <p>{average !== null ? average.toFixed(2) : 'N/A'}</p>
    </div>
  );
};

export default AverageCalculator;
