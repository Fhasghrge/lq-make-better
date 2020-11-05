export function login(userinfo) {
  return {
    type:'LOGIN',
    userinfo
  }
}
export function wxlogin(wxinfo) {
  return {
    type: 'WXINFO',
    wxinfo
  }
}
export function commitGrade(grade) {
  return {
    type:'GRADE',
    grade
  }
}
export function answered() {
  return {
    type: 'ANSWER'
  }
}
export function reText() {
  return {
    type:'RETEXT'
  }
}