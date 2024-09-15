import express from 'express';
import axios from 'axios';
import { Sequelize, DataTypes } from 'sequelize';
import cors from 'cors';

const app = express();
// Use CORS middleware
app.use(cors());

// Connect to PostgreSQL
const sequelize = new Sequelize('crypto_db', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres',
});

// Define the model for storing crypto data
const CryptoData = sequelize.define('crypto_data', {
    name: { type: DataTypes.STRING ,
        unique: true
    },
    last: { type: DataTypes.DECIMAL },
    buy: { type: DataTypes.DECIMAL },
    sell: { type: DataTypes.DECIMAL },
    volume: { type: DataTypes.DECIMAL },
    base_unit: { type: DataTypes.STRING },
  }, {
    timestamps: false,  // Disable timestamps
  });
app.use(express.json());

// Fetch data from the WazirX API
app.get('/', async (req, res) => {
    try {
      const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
      const tickers = response.data;
      
      // Get the top 10 tickers
      const top10 = Object.fromEntries(Object.entries(tickers).slice(0, 10));
      
      console.log(Object.entries(top10)[0]); // Logging the first entry
  
      // Save top 10 tickers to the database
      for (let i = 0; i < 10; i++) {
        // Destructure the entry into key and value
        const [key, value] = Object.entries(top10)[i];
        
        // Now `value` contains the object with ticker details
        await CryptoData.upsert({
          name: value.name,  // Use the name field from value object
          last: value.last,
          buy: value.buy,
          sell: value.sell,
          volume: value.volume,
          base_unit: value.base_unit,
        });
      }
  
      res.status(200).send('Data fetched and stored!');
    } catch (error) {
      console.error(error);  // Log the error for better debugging
      res.status(500).send('Error fetching data');
    }
  });
  
// Route to get stored data
app.get('/crypto-data', async (req, res) => {
  const data = await CryptoData.findAll();
  res.json(data);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

sequelize.sync();
