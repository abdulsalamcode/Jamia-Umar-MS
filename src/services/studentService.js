import api from './api'

const studentService = {

  // ── GET ALL STUDENTS ──
  getAll: () =>
    api.get('/students/index.php'),

  // ── GET MALE STUDENTS ──
  getAllMale: () =>
    api.get('/students/index.php?section=male'),

  // ── GET FEMALE STUDENTS ──
  getAllFemale: () =>
    api.get('/students/index.php?section=female'),

  // ── GET SINGLE STUDENT ──
  getById: (id) =>
    api.get(`/students/single.php?id=${id}`),

  // ── ADD NEW STUDENT ──
  create: (data) =>
    api.post('/students/index.php', data),

  // ── UPDATE STUDENT ──
  update: (id, data) =>
    api.put(`/students/single.php?id=${id}`, data),

  // ── DELETE STUDENT ──
  delete: (id) =>
    api.delete(`/students/single.php?id=${id}`),
}

export default studentService