import { useState } from 'react';

const useToken = () => {
  function getToken() {
    // Attempt to find in local storage.
    const userToken = localStorage.getItem('token');
    // If not null, return parsed result.
    return userToken && JSON.parse(userToken)
  }

  const [token, setToken] = useState(getToken());

  function saveToken(userToken) {
    // Set token in local storage as string.
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };

  function removeToken() {
    // Remove token from local storage
    localStorage.removeItem("token");
    setToken(null);
  }

  return {
    setToken: saveToken,
    token,
    removeToken
  }
}
export default useToken;