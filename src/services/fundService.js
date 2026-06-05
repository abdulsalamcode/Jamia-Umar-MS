import api from './api'

const fundService = {

  // ── GET ALL FUNDS ──
  getAll: (type, status, month) => {
    let url = '/funds/index.php?'
    if (type)   url += `type=${type}&`
    if (status) url += `status=${status}&`
    if (month)  url += `month=${month}&`
    return api.get(url)
  },

  // ── GET SINGLE FUND ──
  getById: (id) =>
    api.get(`/funds/index.php?id=${id}`),

  // ── ADD FUND ──
  create: (data) =>
    api.post('/funds/index.php', data),

  // ── UPDATE FUND ──
  update: (id, data) =>
    api.put(`/funds/index.php?id=${id}`, data),

  // ── UPDATE STATUS ──
  updateStatus: (id, status) =>
    api.put(`/funds/index.php?id=${id}`, { status }),

  // ── DELETE FUND ──
  delete: (id) =>
    api.delete(`/funds/index.php?id=${id}`),
}

export default fundService