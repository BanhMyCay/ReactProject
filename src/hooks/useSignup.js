/**
 * @title     useSignup hook
 * @brief     Custom hooks (useSignup) để thực hiện đăng ký người dùng mới
 * @filename  useFetch.js
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
/** Custom hook (useSignup) để thực hiện đăng ký người dùng mới
 * @Ret1  signup    - hàm thực hiện đăng ký tài khoản mới
 * @Ret2  isPending - components cờ báo đang làm việc với database
 * @Ret3  error     - components chuỗi ký tự báo lỗi
*/
export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)         // component cờ báo sử dụng cleanup funtion cho hàm bất đồng bộ
 
  const [error, setError] = useState(null)                      // component chuỗi ký tự báo lỗi
  const [isPending, setIsPending] = useState(false)             // component cờ báo đang làm việc với database

  /** object gồm các component xử lý xác minh người dùng 
   * @dispatch    hàm thay đổi global component chứa thông tin xác mình người dùng
   */
  const { dispatch } = useAuthContext()

  /**   hàm thực hiện đăng ký tài khoản mới sử dụng dịch vụ firebase authentication
   * @Arg1  email       tên đăng nhập (sử dụng email)
   * @Arg2  password    mật khẩu đăng nhập
   * @Arg3  displayName tên trên react app
   * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
   */
  const signup = async (email, password, displayName) => { 
    setError(null)              // clear components chuỗi ký tự báo lỗi
    setIsPending(true)          // bật cờ báo đang làm việc với firebase
  
    try {
      /**   hàm tạo tài khoản mới với email và password của dịch vụ firebase authentication
       * @res   component liên kết với thông tin tài khoản trên firebase
       */ 
      const res = await projectAuth.createUserWithEmailAndPassword(email, password)
      console.log(res.user)     // log lại thông tin tài khoản

      if (!res) {               // res null - đăng ký thất bại, báo lỗi
        throw new Error('Could not complete signup')
      }

      /**   hàm cập nhật thông tin tài khoản của dịch vụ firebase authentication
       * @res   component liên kết với thông tin tài khoản trên firebase
       */
      await res.user.updateProfile({ displayName })

      /**   hàm thay đổi global component chứa thông tin xác mình người dùng
       * @{}  object action cho hàm
       */ 
      dispatch({ type: 'LOGIN', payload: res.user })
      
      /** cleanup funtion chưa kích hoạt, thực hiện thay đổi các biến trạng thái */ 
      if (!isCancelled) {       
        setIsPending(false)     // tắt cờ báo đang làm việc với firebase
        setError(null)          // clear components chuỗi ký tự báo lỗi
      }
    } 
    catch(err) {                // có lỗi khi chạy hàm
      /** cleanup funtion chưa kích hoạt, thực hiện thay đổi các biến trạng thái */ 
      if (!isCancelled) {       
        setError(err.message)   // lưu lại lỗi vào components error
        setIsPending(false)     // tắt cờ báo đang làm việc với firebase
      }
    }
  }

  /** hooks useEffect để thực hiện việc bật cờ báo sử dụng cleanup funtion cho hàm bất đồng bộ */
  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { signup, error, isPending }
}