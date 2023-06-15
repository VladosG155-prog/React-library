export const baseApiUrl = 'https://strapi.cleverland.by';

export const prepHeaders = (headers, { getState }) => {
  if (localStorage.getItem('jwt')) {
    headers.set('Authorization', `Bearer ${localStorage.getItem('jwt')}`);
  }

  return headers;
};
