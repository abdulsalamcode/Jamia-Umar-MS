import api from './api'

const teacherService = {

  // ── GET ALL TEACHERS ──
  getAll: () =>
    api.get('/teachers/index.php'),

  // ── GET MALE TEACHERS ──
  getAllMale: () =>
    api.get('/teachers/index.php?section=male'),

  // ── GET FEMALE TEACHERS ──
  getAllFemale: () =>
    api.get('/teachers/index.php?section=female'),

  // ── GET SINGLE TEACHER ──
  getById: (id) =>
    api.get(`/teachers/single.php?id=${id}`),

  // ── ADD NEW TEACHER ──
  create: (data) =>
    api.post('/teachers/index.php', data),

  // ── UPDATE TEACHER ──
  update: (id, data) =>
    api.put(`/teachers/single.php?id=${id}`, data),

  // ── DELETE TEACHER ──
  delete: (id) =>
    api.delete(`/teachers/single.php?id=${id}`),
}

export default teacherService