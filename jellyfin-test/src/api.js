const API_URL = process.env.API_URL; 
const ACCESS_TOKEN = process.env.ACCESS_TOKEN; 

export const getItems = async () => {
  const response = await fetch(`${API_URL}/Items?Recursive=true`, {
    headers: {
      'X-Emby-Token': ACCESS_TOKEN,
    },
  });
  const data = await response.json();
  return data.Items; 
};
