// Define an async function to fetch data
async function fetchData() {
    try {
      const response = await fetch('http://localhost:3000/crypto-data'); // Fetch data from the endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Parse JSON from the response
      console.log(data);
  
      const tableBody = document.getElementById('data');
      // Generate table rows and append them to the table body
      data.forEach(item => {
        const row = `<tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.last}</td>
          <td>${item.buy}</td>
          <td>${item.sell}</td>
          <td>${item.volume}</td>
          <td>${item.base_unit}</td>
        </tr>`;
        tableBody.innerHTML += row;
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Call the async function to load data when the page loads
  fetchData();
  