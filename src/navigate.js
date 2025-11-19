let navigateFunction;

export const setNavigate = (nav) => {
  navigateFunction = nav;
};

export const navigate = (path) => {
  if (navigateFunction) navigateFunction(path);
};
