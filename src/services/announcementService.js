import api from './api'

const announcementService = {

  // ── GET ALL ──
  getAll: (type, urgent) => {
    let url = '/announcements/index.php?'
    if (type)   url += `type=${type}&`
    if (urgent !== undefined) url += `urgent=${urgent}&`
    return api.get(url)
  },

  // ── GET SINGLE ──
  getById: (id) =>
    api.get(`/announcements/index.php?id=${id}`),

  // ── ADD ──
  create: (data) =>
    api.post('/announcements/index.php', data),

  // ── UPDATE ──
  update: (id, data) =>
    api.put(`/announcements/index.php?id=${id}`, data),

  // ── DELETE ──
  delete: (id) =>
    api.delete(`/announcements/index.php?id=${id}`),
}

export default announcementService