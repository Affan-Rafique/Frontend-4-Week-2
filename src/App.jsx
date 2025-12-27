import { useState } from "react";
import "./App.css";

function App() {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState("");

  const handleLookup = async () => {
    setError("");
    setData([]);
    setFilteredData([]);

    if (pincode.length !== 6 || isNaN(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const result = await response.json();

      if (result[0].Status === "Error") {
        setError(result[0].Message);
        setLoading(false);
        return;
      }

      setData(result[0].PostOffice);
      setFilteredData(result[0].PostOffice);
      setLoading(false);
    } catch (err) {
      setError("Something went wrong while fetching data.");
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterText(value);

    const filtered = data.filter((item) =>
      item.Name.toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  return (
    <div className="app">
      <h1>Pincode Lookup</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <button onClick={handleLookup}>Lookup</button>
      </div>

      {loading && <div className="loader"></div>}

      {error && <p className="error">{error}</p>}

      {data.length > 0 && (
        <>
          <input
            type="text"
            className="filter"
            placeholder="Filter by Post Office name"
            value={filterText}
            onChange={handleFilter}
          />

          <div className="cards">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <div className="card" key={index}>
                  <p><strong>Name:</strong> {item.Name}</p>
                  <p><strong>Pincode:</strong> {item.Pincode}</p>
                  <p><strong>District:</strong> {item.District}</p>
                  <p><strong>State:</strong> {item.State}</p>
                </div>
              ))
            ) : (
              <p className="error">
                Couldn’t find the postal data you’re looking for…
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
