import api from './api'

const admissionService = {

  // ── GET ALL ──
  getAll: (section, status) => {
    let url = '/admissions/index.php?'
    if (section) url += `section=${section}&`
    if (status)  url += `status=${status}&`
    return api.get(url)
  },

  // ── GET SINGLE ──
  getById: (id) =>
    api.get(`/admissions/index.php?id=${id}`),

  // ── SUBMIT ADMISSION ──
  create: (data) =>
    api.post('/admissions/index.php', data),

  // ── UPDATE STATUS ──
  updateStatus: (id, status, remarks, reviewed_by = 1) =>
    api.put(`/admissions/index.php?id=${id}`, { status, remarks, reviewed_by }),

  // ── DELETE ──
  delete: (id) =>
    api.delete(`/admissions/index.php?id=${id}`),
}

export default admissionService