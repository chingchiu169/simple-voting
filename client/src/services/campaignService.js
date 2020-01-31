import axios from 'axios';

export default {
  getAll: async () => {
    let res = await axios.get(`/api/campaign`);
    return res.data || [];
  },
  regCampaign: async (data) => {
    let res = await axios.post(`/api/campaign`, data);
    return res.data || [];
  }
}