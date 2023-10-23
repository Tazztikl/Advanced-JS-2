
export const fetchData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch, status ${response.status}`);
    }
    
    return await response.json();
  };
  