/**
 * @title     Authentication context
 * @brief     Context chứa thông tin xác minh người dùng
 * @filename  ThemeContext.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components (createContext, useReducer) */
import { createContext, useReducer, useEffect } from 'react'

/** Firebase component (authentication) */
import { projectAuth } from '../firebase/config'  

/** -------------------------------------------------------------------------- 
  @CONTEXT -------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Context chứa thông tin xác minh người dùng */
export const AuthContext = createContext()



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/**   hàm thay đổi giá trị component chứ thông tin xác minh người dùng 
 * @state     component cần thay đổi (gắn với hook useReducer)
 * @action    action sẽ thay đổi component (gắn với hook useReducer)
 */
export const authReducer = (state, action) => {
  /** switch theo từng action.type thay đổi component */
  switch (action.type) {

    case 'LOGIN':           // đăng nhập, update component theo thông tin người dùng vừa đăng nhập
      return { ...state, user: action.payload }
    case 'LOGOUT':          // đăng xuất, update component về null
      return { ...state, user: null }
    case 'AUTH_IS_READY':          // đăng xuất, update component về null
      return { user: action.payload, authIsReady: true }
    default:
      return state
  }
}


/** Provider để bọc các component sử dụng context chứa xác minh người dùng
 * @children    component con cần bọc
*/
export const AuthContextProvider = ({ children }) => {

  /**   component chứa thông tin  xác minh người dùng của context sử dụng hook useReducer
   * @state         tên component
   * @dispatch      tên hàm đăng ký gắn giá trị component với return hàm authReducer
   * @authReducer   hàm thay đổi giá trị component state theo action với dịch vụ xác minh người dùng        
   * @{user:null}   giá trị khởi đầu cho component state (thông tin người dùng: null)
   * @{authIsReady:false} giá trị khởi đầu cho component state (đã xác minh người dùng: false)
   */
  const [state, dispatch] = useReducer(authReducer, { 
    user: null,
    authIsReady: false

  })
  
  /** hook useEffect để thực hiện lần đầu quét đã có tài khoản đăng nhập chưa */
  useEffect(() => {
    /**   hàm quét tài khoản đã đăng nhập trên firebase, nếu có chạy hàm bên trong (quét liên tục)
     * @user  thông tin người dùng lấy được trên firebase
     * @unsub component liên kết return hàm để chỉ thực hiện quét một lần
     */ 
    const unsub = projectAuth.onAuthStateChanged(user => {
      
      /**   hàm thay đổi global component chứa thông tin xác mình người dùng
       * @{}  object action cho hàm (AUTH_IS_READY)
       */ 
      dispatch({ type: 'AUTH_IS_READY', payload: user })
      unsub()
    })
  }, [])

  /** log lại thông tin  xác minh người dùng */
  console.log('AuthContext state:', state)

  return (
    /** Provider để bọc các component sử dụng context chứa xác minh người dùng
     * @value   Context object chứa các component sẽ được sử dụng trong component con được bọc 
     *          bởi Provider
     */
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )
}