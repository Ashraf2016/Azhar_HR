import axios from "axios";

const api = axios.create({
  baseURL: "https://university.roboeye-tec.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getData = async (endpoint, query = {}) => {
  try {
    const response = await api.get(endpoint, { params: query });
    return response.data;
  } catch (error) {
    console.error("GET Error:", error);
    throw error;
  }
};

export const postData = async (endpoint, payload = {}, config = {}) => {
  try {
    const response = await api.post(endpoint, payload, config); // config can include query params
    return response.data;
  } catch (error) {
    console.error("POST Error:", error);
    throw error;
  }
  // body
  // await postData('/users', { name: 'John' });
  // query
  // await postData('/users', { name: 'John' }, { params: { role: 'admin' } });
  // post with header
  // await postData('/users', { name: 'John' }, { headers: { Authorization: 'Bearer token' } });
};
