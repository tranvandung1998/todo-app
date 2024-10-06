import axios from 'axios';

export const getDataToDo = async () => {
  const response = await axios.get('http://localhost:5002/tasks');
  return response.data;
};

export const postDataToDo = async (task) => {
  const response = await axios.post('http://localhost:5002/tasks', task);
  return response.data;
};

export const putDataToDo = async (id, task) => {
  const response = await axios.put(`http://localhost:5002/tasks/${id}`, task);
  return response.data;
};
