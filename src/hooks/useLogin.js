/**
 * @title     useLogin hook
 * @brief     Custom hooks (useLogin) để thực hiện đăng nhập tài khoản
 * @filename  useLogin.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React hooks (useState, useEffect) */
import { useState, useEffect } from 'react'

/** Firebase component (authentication) */
import { projectAuth } from '../firebase/config'                

/** Custom hooks */
import { useAuthContext } from './useAuthContext'               // Hooks để sủ dụng context chứa xác minh người dùng



/** -------------------------------------------------------------------------- 
  @CUSTOM_HOOK_FUNCTIONS -----------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hook (useLogin) để thực hiện đăng nhập tài khoản
 * @Ret1  login     - hàm thực hiện đăng nhập tài khoản
 * @Ret2  isPending - components cờ báo đang làm việc với database
 * @Ret3  error     - components chuỗi ký tự báo lỗi
*/
export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)         // component cờ báo sử dụng cleanup funtion cho hàm bất đồng bộ
  
  const [error, setError] = useState(null)                      // component chuỗi ký tự báo lỗi
  const [isPending, setIsPending] = useState(false)             // component cờ báo đang làm việc với database

  /** object gồm các component xử lý xác minh người dùng 
   * @dispatch    hàm thay đổi global component chứa thông tin xác mình người dùng
   */
  const { dispatch } = useAuthContext()

  /**   hàm thực hiện đăng nhập tài khoản sử dụng dịch vụ firebase authentication
   * @Arg1  email       tên đăng nhập (sử dụng email)
   * @Arg2  password    mật khẩu đăng nhập
   * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
   */
  const login = async (email, password) => {
    setError(null)              // clear components chuỗi ký tự báo lỗi
    setIsPending(true)          // bật cờ báo đang làm việc với firebase
  
    try {
      /**   hàm đăng nhập tài khoản với email và password của dịch vụ firebase authentication
       * @res   component liên kết với thông tin tài khoản trên firebase
       */ 
      const res = await projectAuth.signInWithEmailAndPassword(email, password)

      /**   hàm thay đổi global component chứa thông tin xác mình người dùng
       * @{}  object action cho hàm
       */ 
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { login, isPending, error }
}