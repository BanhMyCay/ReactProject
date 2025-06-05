/**
 * @title     useMongo hook
 * @brief     Custom hooks (useMongo) để sử dụng dịch vụ database của mongoDB
 * @filename  useMongo.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      03/06/2025
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components (useReducer, useEffect, useState) */
import { 
  useReducer, // hooks quản lý state phức tạp
  useEffect,  // hooks xử lý side effects (chạy code phụ trợ sau khi component render)
  useState,   // hooks lưu trữ và cập nhật state
} from "react"

/** Axios component */
import axios from "axios";  // thư viện HTTP client giúp bạn gửi request và nhận response từ một server 



/** -------------------------------------------------------------------------- 
  @LOCAL_STATE ---------------------------------------------------------------
--------------------------------------------------------------------------- */
/** object chứa các component respone (giá trị mặc định) của hooks sử dụng dịch vụ database
 * @document    component chứa dữ liệu để lưu trên database
 * @isPending   component cờ báo đang làm việc với database
 * @error       component chuỗi ký tự báo lỗi
 * @success     component báo hook hđ ok/ng
 */
let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
}



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/**   hàm thay đổi giá trị các component trong object respone của hooks sử dụng dịch vụ database
 * @state     object cần thay đổi (gắn với hook useReducer)
 * @action    action sẽ thay đổi component (gắn với hook useReducer)
 */
const mongoReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":          // báo hooks đang làm việc với database
      return {success: false, isPending: true, error: null, document: null}
    case "ERROR":               // báo hooks có lỗi
      return {success: false, isPending: false, error: action.payload, document: action.payload}
    case "ADDED_DOCUMENT":      // báo hooks vừa thêm một document mới
      return {success: true, isPending: false, error: null, document: action.payload}
    case 'DELETED_DOCUMENT':    // báo hooks vừa xóa một document mới
      return { isPending: false, document: null, success: true, error: null }
    case "UPDATED_DOCUMENT":    // báo hooks vừa sửa document
      return { isPending: false, document: action.payload, success: true,  error: null }
    default:
      return state
  }
}



/** -------------------------------------------------------------------------- 
  @CUSTOM_HOOK_FUNCTIONS -----------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hook (useMongo) để sủ dụng dịch vụ database của Firebase
 * @Arg1  collection        - tên collection cần sử dụng
 * @Ret1  addDocument       - hàm thêm một mục document
 * @Ret2  deleteDocument    - hàm xóa một mục document
 * @Ret3  updateDocument    - hàm sửa một mục document
 * @Ret4  response          - object respone của hooks
*/
export const useMongoDB  = (colName) => {
  /**   object chứa respone của hooks sử dụng dịch vụ database sử dụng hook useReducer
   * @response      tên object
   * @dispatch      tên hàm đăng ký gắn giá trị object với return hàm firestoreReducer
   * @firestoreReducer   hàm thay đổi giá trị object response theo action với dịch vụ database
   * @initialState  giá trị khởi đầu cho object response
   */
  const [response, dispatch] = useReducer(mongoReducer, initialState)
  
  const [isCancelled, setIsCancelled] = useState(false) // component cờ báo sử dụng cleanup funtion cho hàm bất đồng bộ
  
  /**   hàm thực hiện thay đổi object respone của hooks khi hooks chưa hủy liên kết
   * @action    action sẽ thay đổi object (gắn với hook useReducer)
   */
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  /**   hàm thực hiện thêm document sử dụng dịch vụ database
   * @Arg1  doc - component đại diện document     
   * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
   */
  const addDocument = async (docData) => {
    /** thay đổi object respone của hooks về trạng thái đang đang làm việc với database */
    dispatch({ type: "IS_PENDING" })

    try {
      /**   hàm lấy thời gian hiện tại
       * @createdAt      component chưa thời gian hiện tại
       */ 
      const createdAt = new Date()

      /**   hàm thêm một document mới lên database
       * @res   phản hồi từ backend
       */ 
      const res = await axios.post(`/api/${colName}`, { ...docData, createdAt })
      dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: res.data })
    } catch (err) { // thay đổi object respone của hooks khi gặp lỗi
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message })
    }
  }

  /**   hàm thực hiện xóa document sử dụng dịch vụ database
   * @Arg1  id  - id đại diện document
   * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
   */
  const deleteDocument = async (id) => {
    /** thay đổi object respone của hooks về trạng thái đang đang làm việc với database */
    dispatch({ type: 'IS_PENDING' })

    try {
      /**   hàm xóa một document trên database
       * @res   phản hồi từ backend
       */ 
      const res = await axios.delete(`/api/${colName}/${id}`)

      /** thay đổi object respone của hooks khi xóa một document */
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT', payload: res.data })
    }
    catch (err) {
      /** thay đổi object respone của hooks khi gặp lỗi */ 
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' })
    }
  }

  /**   hàm thực hiện sửa document sử dụng dịch vụ database
   * @Arg1  id      - id đại diện document
   * @Arg2  updates - components chứa document cần update
   * @Ret1  updatedDocument - component liên kết document đã sửa trên firestore của firebase
   * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
   */
  const updateDocument = async (id, updates) => {
    /** thay đổi object respone của hooks về trạng thái đang đang làm việc với database */
    dispatch({ type: "IS_PENDING" })

    try {
      /**   hàm sửa (update) một document có id 'id' theo nội dung 'updates' lên database 
       * @res   phản hồi từ backend
       */ 
      const res = await axios.patch(`/api/${colName}/${id}`, updates)

      /** thay đổi object respone của hooks khi sửa một document */
      dispatchIfNotCancelled({ type: "UPDATED_DOCUMENT", payload: res.data })
      return res.data
    } 
    catch (error) {
      /** thay đổi object respone của hooks khi gặp lỗi */ 
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not update' })
      return null
    }
  }

  /** hooks useEffect để thực hiện việc bật cờ báo sử dụng cleanup funtion cho hàm bất đồng bộ */
  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { addDocument, deleteDocument, updateDocument, response }

}