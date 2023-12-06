// Set User Token in Async Storage
export const setUserToken = (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem("@authToken", jsonValue);
  } catch (e) {
    throw Error(e);
  }
};

// Get User Token from Async Storage
export const getUserToken = () => {
  try {
    const jsonValue = localStorage.getItem("@authToken");
    if (jsonValue) {
      return JSON.parse(jsonValue);
    }
    return null;
  } catch (e) {
    throw Error(e);
  }
};

//Delete User Token from Async Storage
export const deleteUserToken = () => {
  try {
    localStorage.clear();
  } catch (e) {
    throw Error(e);
  }
};
