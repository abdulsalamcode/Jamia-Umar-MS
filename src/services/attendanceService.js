import api from './api'

const attendanceService = {

  // ── GET TEACHER ATTENDANCE ──
  getTeacherAttendance: (date, section) => {
    let url = `/attendance/teachers.php?date=${date}`
    if (section) url += `&section=${section}`
    return api.get(url)
  },

  // ── GET STUDENT ATTENDANCE ──
  getStudentAttendance: (date, section, course) => {
    let url = `/attendance/students.php?date=${date}`
    if (section) url += `&section=${section}`
    if (course)  url += `&course=${course}`
    return api.get(url)
  },

  // ── GET TEACHER MONTHLY ──
  getTeacherMonthly: (month, section) => {
    let url = `/attendance/teachers.php?month=${month}`
    if (section) url += `&section=${section}`
    return api.get(url)
  },

  // ── GET STUDENT MONTHLY ──
  getStudentMonthly: (month, section, course) => {
    let url = `/attendance/students.php?month=${month}`
    if (section) url += `&section=${section}`
    if (course)  url += `&course=${course}`
    return api.get(url)
  },

  // ── SAVE TEACHER ATTENDANCE ──
  saveTeacherAttendance: (date, attendance, marked_by = 1) =>
    api.post('/attendance/teachers.php', { date, attendance, marked_by }),

  // ── SAVE STUDENT ATTENDANCE ──
  saveStudentAttendance: (date, attendance, marked_by = 1) =>
    api.post('/attendance/students.php', { date, attendance, marked_by }),
}

export default attendanceService