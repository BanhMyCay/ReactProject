/**
 * @title     useAuthContext hook
 * @brief     Custom hooks (useAuthContext) để sủ dụng context chứa xác minh người dùng
 * @filename  useAuthContext.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      02/06/2025
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components (useContext) */
import { useContext } from "react"

/** Context */
import { AuthContext } from "../context/AuthContext"  // Context chứa xác minh người dùng



/** -------------------------------------------------------------------------- 
  @CUSTOM_HOOK_FUNCTIONS -----------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hook (useAuthContext) để sủ dụng context chứa xác minh người dùng
 * @Ret1  context   - Component chứa object gồm các component xử lý xác minh người dùng lưu trong context
*/
export const useAuthContext = () => {
  /** Component chứa chứa object gồm các component xử lý xác minh người dùng lấy từ Context */
  const context = useContext(AuthContext)

  if(!context) {            // không lấy được object, báo lỗi
    throw Error('useAuthContext must be used inside an AuthContextProvider')
  }

  return context
}