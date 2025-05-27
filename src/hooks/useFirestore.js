/**
 * @title     useFirestore hook
 * @brief     Custom hooks (useFirestore) để sử dụng dịch vụ firestore của firebase
 * @filename  useFirestore.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components (useReducer, useEffect, useState) */
import { useReducer, useEffect, useState } from "react"

/** Firebase component (firestore, timestamp) */
import { projectFirestore, timestamp } from "../firebase/config"



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
const firestoreReducer = (state, action) => {
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
/** Custom hook (useFirestore) để sủ dụng dịch vụ database của Firebase
 * @Arg1  collection        - tên collection cần sử dụng
 * @Ret1  addDocument       - hàm thêm một mục document
 * @Ret2  deleteDocument    - hàm xóa một mục document
 * @Ret3  updateDocument    - hàm sửa một mục document
 * @Ret4  response          - object respone của hooks
*/
export const useFirestore = (collection) => {
  /**   object chứa respone của hooks sử dụng dịch vụ database sử dụng hook useReducer
   * @response      tên object
   * @dispatch      tên hàm đăng ký gắn giá trị object với return hàm firestoreReducer
   * @firestoreReducer   hàm thay đổi giá trị object response theo action với dịch vụ database
   * @initialState  giá trị khởi đầu cho object response
   */
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  
  const [isCancelled, setIsCancelled] = useState(false) // component cờ báo sử dụng cleanup funtion cho hàm bất đồng bộ

  /** Component liên kết với Collection của dịch vụ database tên Firebase 
   * @collection    tên collection cần liên kết 
   */
  const ref = projectFirestore.collection(collection)
  
  /**   hàm thực hiện thay đổi object respone của hooks khi hooks chưa hủy liên kết
   * @action    action sẽ thay đổi object (gắn với hook useReducer)
   */
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  /**   hàm thực hiện thêm document sử dụng dịch vụ database
   * @Arg1  doc     component đại diện document     
   * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
   */
  const addDocument = async (doc) => {
    /** thay đổi object respone của hooks về trạng thái đang đang làm việc với database */
    dispatch({ type: "IS_PENDING" })

    try {
      /**   hàm lấy thời gian hiện tại của dịch vụ firestore trên firebase
       * @createdAt      component chưa thời gian hiện tại
       */ 
      const createdAt = timestamp.fromDate(new Date())

      /**   hàm thêm một document mới lên firestore của firebase
       * @addedDocument   component liên kết document mới trên firestore của firebase
       */ 
      const addedDocument = await ref.add({...doc, createdAt })

      /** thay đổi object respone của hooks khi thêm một document mới */
      dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: addedDocument })
    }
    catch (err) {
      /** thay đổi object respone của hooks khi gặp lỗi */ 
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message })
    }
  }

  /**   hàm thực hiện xóa document sử dụng dịch vụ database
   * @Arg1  id      id đại diện document
   * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
   */
  const deleteDocument = async (id) => {
    /** thay đổi object respone của hooks về trạng thái đang đang làm việc với database */
    dispatch({ type: 'IS_PENDING' })

    try {
      /**   hàm xóa (delete) một document theo id (doc(id)) trên firestore của firebase 
       * @deletedDocument component liên kết document đã xóa trên firestore của firebase
       */ 
      const deletedDocument = await ref.doc(id).delete()

      /** thay đổi object respone của hooks khi xóa một document */
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT', payload: deletedDocument })
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
      /**   hàm sửa (update) một document có id 'id' theo nội dung 'updates' lên firestore của firebase 
       * @updatedDocument component liên kết document đã sửa trên firestore của firebase
       */ 
      const updatedDocument = await ref.doc(id).update(updates)

      /** thay đổi object respone của hooks khi sửa một document */
      dispatchIfNotCancelled({ type: "UPDATED_DOCUMENT", payload: updatedDocument })

      return updatedDocument
    } 
    catch (error) {
      /** thay đổi object respone của hooks khi gặp lỗi */ 
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' })

      return null
    }
  }

  /** hooks useEffect để thực hiện việc bật cờ báo sử dụng cleanup funtion cho hàm bất đồng bộ */
  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { addDocument, deleteDocument, updateDocument, response }

}