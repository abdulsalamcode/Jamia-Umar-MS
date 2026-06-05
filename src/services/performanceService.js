import api from './api'

const performanceService = {

  // ── GET ALL ──
  getAll: (month, section) => {
    let url = '/performance/index.php?'
    if (month)   url += `month=${month}&`
    if (section) url += `section=${section}&`
    return api.get(url)
  },

  // ── GET BY TEACHER ──
  getByTeacher: (id) =>
    api.get(`/performance/index.php?id=${id}`),

  // ── ADD ──
  create: (data) =>
    api.post('/performance/index.php', data),

  // ── DELETE ──
  delete: (id) =>
    api.delete(`/performance/index.php?id=${id}`),
}

export default performanceService