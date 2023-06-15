export const baseApiUrl = 'https://library-cleverland-2jfze.ondigitalocean.app/ ';

export const prepHeaders = (headers, { getState }) => {
  if (localStorage.getItem('jwt')) {
    headers.set('Authorization', `Bearer ${localStorage.getItem('jwt')}`);
  }

  return headers;
};
