/**
 * @title     useLogout hook
 * @brief     Custom hooks (useLogout) để thực hiện đăng xuất tài khoản
 * @filename  useLogout.js
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

/** Firebase component (authentication, firestore) */
import { projectAuth, projectFirestore } from '../firebase/config'                
import { signOut } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'

/** Custom hooks */
import { useAuthContext } from './useAuthContext'               // Hooks để sủ dụng context chứa xác minh người dùng



/** -------------------------------------------------------------------------- 
  @CUSTOM_HOOK_FUNCTIONS -----------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hook (useLogout) để thực hiện đăng xuất tài khoản
 * @Ret1  logout    - hàm thực hiện đăng xuất tài khoản
 * @Ret2  isPending - components cờ báo đang làm việc với database
 * @Ret3  error     - components chuỗi ký tự báo lỗi
*/
export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false)         // component cờ báo sử dụng cleanup funtion cho hàm bất đồng bộ
  const [error, setError] = useState(null)                      // component chuỗi ký tự báo lỗi
  const [isPending, setIsPending] = useState(false)             // component cờ báo đang làm việc với database

  /** object gồm các component xử lý xác minh người dùng 
   * @dispatch    hàm thay đổi global component chứa thông tin xác mình người dùng
   */
  const { dispatch } = useAuthContext()

  /**   hàm thực hiện đăng xuất tài khoản sử dụng dịch vụ firebase authentication
   * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
   */
  const logout = async () => {
    setError(null)              // clear components chuỗi ký tự báo lỗi
    setIsPending(true)          // bật cờ báo đang làm việc với firebase
  
    try {
      /** object chứa thông tin người dùng hiện tại */
      const { uid } = projectAuth.currentUser

      /**   hàm update thuộc tính của document với id của người dùng thuộc collection users trên firestore
       * @online  trạng thái online
       */ 
      await updateDoc(doc(projectFirestore, 'users', uid), { online: false })

      /**   hàm đăng xuất tài khoản của dịch vụ firebase authentication
       * @res   component liên kết với thông tin tài khoản trên firebase
       */ 
      await signOut(projectAuth)

      /**   hàm thay đổi global component chứa thông tin xác mình người dùng
       * @{}  object action cho hàm
       */ 
      dispatch({ type: 'LOGOUT' })

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

  return { logout, error, isPending }
}