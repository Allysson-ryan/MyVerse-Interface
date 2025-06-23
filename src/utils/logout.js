export const logoutUser = () => {
  localStorage.removeItem("MyVerse:userData");
  window.location.href = "/entrar";
};
