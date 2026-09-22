
import { useState } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();

    const medicineName = searchTerm.trim();
    if (!medicineName) return;

    setError('');
    setMedicines([]);
    setSelectedMedicine(null);

    const apiUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(medicineName)}"&limit=20`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Medicine not found');

      const data = await response.json();
      setMedicines(data.results);
    } catch {
      setError('No medicine details found. Try a brand name such as Advil.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {selectedMedicine ? (
          <section className="medicine-page">
            <button type="button" onClick={() => setSelectedMedicine(null)}>
              Back to results
            </button>
            <h1>{selectedMedicine.openfda.brand_name?.[0] || 'Medicine details'}</h1>
            <p><strong>Generic name:</strong> {selectedMedicine.openfda.generic_name?.[0] || 'Not available'}</p>
            <p><strong>Manufacturer:</strong> {selectedMedicine.openfda.manufacturer_name?.[0] || 'Not available'}</p>
            <p><strong>Product type:</strong> {selectedMedicine.openfda.product_type?.[0] || 'Not available'}</p>
            <p><strong>Route:</strong> {selectedMedicine.openfda.route?.[0] || 'Not available'}</p>
            <p><strong>Active ingredients:</strong> {selectedMedicine.openfda.active_ingredient?.[0] || 'Not available'}</p>
          </section>
        ) : (
          <>
            <h1>Medicine Search</h1>

            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Search for a medicine..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            {error && <p className="error">{error}</p>}

            <section className="results">
              {medicines.map((medicine) => (
                <button
                  className="medicine-card"
                  key={medicine.openfda.package_ndc?.[0] || medicine.openfda.brand_name?.[0]}
                  onClick={() => setSelectedMedicine(medicine)}
                  type="button"
                >
                  <h2>{medicine.openfda.brand_name?.[0] || 'Unknown medicine'}</h2>
                  <p><strong>Generic name:</strong> {medicine.openfda.generic_name?.[0] || 'Not available'}</p>
                  <p><strong>Manufacturer:</strong> {medicine.openfda.manufacturer_name?.[0] || 'Not available'}</p>
                </button>
              ))}
            </section>
          </>
        )}
      </header>
    </div>
  );
}

export default App; 
