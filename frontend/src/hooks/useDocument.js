/**
 * @title     useDocument hook
 * @brief     Custom hooks (useDocument) liên kết 1 document trên firestore của firebase
 * @filename  useFirestore.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components */
import { 
  useEffect,  // hooks xử lý side effects (chạy code phụ trợ sau khi component render)
  useState,   // hooks lưu trữ và cập nhật state
} from "react"

/** Axios component */
import axios from "axios";  // thư viện HTTP client giúp bạn gửi request và nhận response từ một server  



/** -------------------------------------------------------------------------- 
  @CUSTOM_HOOK_FUNCTIONS -----------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hook (useDocument) liên kết 1 document trên firestore của firebase
 * @Arg1  collection- tên collection cần sử dụng
 * @Ret2  id        - id của document
 * @Ret1  document  - component liên kết với document
 * @Ret2  error     - component lỗi khi sử dụng hook
*/
export const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null)    // component liên kết với document
  const [error, setError] = useState(null)          // component lỗi khi sử dụng hook

  /** Sử dụng hooks useEffect để lấy dữ liệu document trên database
   * @dependency1   collection  - tên collection cần sử dụng
   * @dependency2   id          - id của document
   */
  useEffect(() => {
    /** Hàm để lấy dữ liệu từ document của backend
     * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
     */
    const fetchDocument = async () => {
      try {
        /** Component 'url' chứa địa chỉ gọi API, VD: /api/products */
        const response = await axios.get(`/api/documents/${collection}/${id}`)
        
        if (response.data) {  // Nếu response có dữ liệu
          setDocument({ ...response.data, id }) // Cập nhật state 'document' với dữ liệu trả về từ MongoDB.
          setError(null)      // Xóa lỗi cũ (nếu có)
        } else {              // Nếu không có dữ liệu (null hoặc undefined), báo lỗi: document không tồn tại.
          setError("No such document exists")
        }
      } catch (err) {   // Nếu xảy ra lỗi trong quá trình gọi API:
        console.log(err.message)          // log lỗi
        setError("Failed to get document")// Cập nhật state 'error' với thông báo lỗi.
      }
    }

    fetchDocument()
  }, [collection, id])

  return { document, error }
}