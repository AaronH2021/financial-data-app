import axios from 'axios';

// Access the API key using process.env.REACT_APP_API_KEY
const API_KEY = process.env.REACT_APP_API_KEY; // This will work with CRA
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Function to fetch income statements
export const fetchIncomeStatements = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/income-statement/AAPL?period=annual&apikey=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching income statements:', error);
    return [];
  }
};

console.log("API Key:", API_KEY);
