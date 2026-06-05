import api from './api'

const testService = {

  // ── GET ALL ──
  getAll: (section, subject) => {
    let url = '/tests/index.php?'
    if (section) url += `section=${section}&`
    if (subject) url += `subject=${subject}&`
    return api.get(url)
  },

  // ── GET SINGLE ──
  getById: (id) =>
    api.get(`/tests/index.php?id=${id}`),

  // ── GET BY STUDENT ──
  getByStudent: (student_id) =>
    api.get(`/tests/index.php?student_id=${student_id}`),

  // ── ADD ──
  create: (data) =>
    api.post('/tests/index.php', data),

  // ── UPDATE ──
  update: (id, data) =>
    api.put(`/tests/index.php?id=${id}`, data),

  // ── DELETE ──
  delete: (id) =>
    api.delete(`/tests/index.php?id=${id}`),
}

export default testService