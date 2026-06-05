import api from './api'

const expenseService = {

  // ── GET ALL EXPENSES ──
  getAll: (category, month, type) => {
    let url = '/expenses/index.php?'
    if (category) url += `category=${category}&`
    if (month)    url += `month=${month}&`
    if (type)     url += `type=${type}&`
    return api.get(url)
  },

  // ── GET SINGLE EXPENSE ──
  getById: (id) =>
    api.get(`/expenses/index.php?id=${id}`),

  // ── ADD EXPENSE ──
  create: (data) =>
    api.post('/expenses/index.php', data),

  // ── UPDATE EXPENSE ──
  update: (id, data) =>
    api.put(`/expenses/index.php?id=${id}`, data),

  // ── DELETE EXPENSE ──
  delete: (id) =>
    api.delete(`/expenses/index.php?id=${id}`),
}

export default expenseService