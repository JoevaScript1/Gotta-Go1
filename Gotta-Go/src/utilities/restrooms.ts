
const fetchRestrooms = async (region) => {
    if (!region) return;
    // setLoading(true); // Start loading indicator
    const { latitude, longitude } = region;

      const response = await fetch(
        `https://www.refugerestrooms.org/api/v1/restrooms/by_location?lat=${latitude}&lng=${longitude}&per_page=${numberOnPage}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response');
      }

      const data = await response.json();
      return data 
    }
 