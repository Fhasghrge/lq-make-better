/* 用户信息数据
 */
const initData = {
  info: {
    url: '',
    name: '昵称',
    openid: 'defau',
    stdNumber: '',
    stdPassWd: ''
  },
  login: false,
  haveAnswered: false,
  grade: 0,
  try: -1
}

const reducer = (state = initData, action) => {
  switch (action.type) {
    case 'LOGIN':
      return Object.assign({}, state,
        {
          info: {
            ...state.info,
            ...action.userinfo
          },
          login: true
        })
    case 'GRADE':
      return Object.assign({}, state,
        {
          grade: action.grade.score,
          try: action.grade.try
        })
    case 'ANSWER':
      return Object.assign({}, state, {
        haveAnswered: true
      })
    case 'RETEXT':
      return Object.assign({}, state, {
        haveAnswered: false,
        grade: 0
      })
    case 'WXINFO':
      return Object.assign({}, state, {
        info: {
          ...state.info,
          url: action.wxinfo.iconurl,
          name: action.wxinfo.nickname,
          openid: action.wxinfo.openid
        }
      })
    default:
      return state
  }
}
export default reducer