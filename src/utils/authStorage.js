export const getUserData = () => {
  try {
    const data = localStorage.getItem("MyVerse:userData");
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const getToken = () => {
  return getUserData()?.token || null;
};
