import api from './api'

const salaryService = {

  // ── GET ALL SALARIES ──
  getAll: (month, section, status) => {
    let url = '/salaries/index.php?'
    if (month)   url += `month=${month}&`
    if (section) url += `section=${section}&`
    if (status)  url += `status=${status}&`
    return api.get(url)
  },

  // ── ADD SALARY RECORD ──
  create: (data) =>
    api.post('/salaries/index.php', data),

  // ── MARK AS PAID ──
  markAsPaid: (id, paid_by = 1) =>
    api.put(`/salaries/pay.php?id=${id}`, { paid_by }),

  // ── DELETE SALARY ──
  delete: (id) =>
    api.delete(`/salaries/pay.php?id=${id}`),
}

export default salaryService