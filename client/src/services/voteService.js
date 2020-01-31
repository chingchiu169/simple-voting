import axios from 'axios';

export default {
  getVoted: async (data) => {
    let res = await axios.put(`/api/vote`, data);
    return res.data || [];
  },
  voteCampaign: async (data) => {
    let res = await axios.post(`/api/vote`, data);
    return res.data || [];
  },
}