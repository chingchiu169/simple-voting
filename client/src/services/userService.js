import axios from 'axios';

export default {
  // Reigster user
  regUser: async (data) => {
    let res = await axios.post(`/api/user`, data);
    return res.data || [];
  },
  // Update user
  updateUser: async (data) => {
    let res = await axios.put(`/api/user`, data);
    return res.data || [];
  },
  // Check user token
  checkUser: async (data) => {
    let res = await axios.patch(`/api/user`, data);
    return res.data || [];
  }
}