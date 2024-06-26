export const removeQueryParamsFromURL = () => {
  const urlWithoutParams = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, urlWithoutParams);
};
