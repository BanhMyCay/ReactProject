/**
 * @title     useDocument hook
 * @brief     Custom hooks (useDocument) liên kết 1 document trên firestore của firebase
 * @filename  useFirestore.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      03/06/2025
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components */
import { 
  useEffect,  // hooks xử lý side effects (chạy code phụ trợ sau khi component render)
  useState,   // hooks lưu trữ và cập nhật state
} from "react"

/** Firebase component */
import { projectFirestore } from "../firebase/config"   // component kết nối với dịch vụ database (firestore) của firebase
import { 
  doc,          // Tham chiếu đến một document trong Firestore.
  onSnapshot    // Lắng nghe sự thay đổi dữ liệu realtime.
} from 'firebase/firestore' // dịch vụ database (firestore) của firebase

/** Backend API modules */   
import axios from "axios";  // Axios modules, HTTP client, giúp gửi các request (GET, POST, PUT, DELETE,...) đến server khác.



/** -------------------------------------------------------------------------- 
  @CUSTOM_HOOK_FUNCTIONS -----------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hook (useDocument) liên kết 1 document trên firestore của firebase
 * @Arg1  collection- tên collection cần sử dụng
 * @Arg2  id        - id của document
 * @Arg3  typeDB    - loại database (false-firestore/true-mongoDB)
 * @Ret1  document  - component liên kết với document
 * @Ret2  isPending - component cờ báo đang làm việc với database
 * @Ret3  error     - component lỗi khi sử dụng hook
 * 
*/
export const useDocument = (collection, id, typeDB = false) => {
  const [document, setDocument] = useState(null)    // component liên kết với document
  const [error, setError] = useState(null)          // component lỗi khi sử dụng hook
  const [isPending, setIsPending] = useState(false) // component cờ báo đang làm việc với database

  /** Sử dụng hooks useEffect để lấy dữ liệu document trên database
   * @dependency1   collection  - tên collection cần sử dụng
   * @dependency2   id          - id của document
   */
  useEffect(() => {
    /** Component liên kết với return của hàm "onSnapshot" của firestore */
    let unsubscribe;

    /** Hàm để lấy dữ liệu từ document từ backend
     * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
     */
    const fetchDocument1 = async () => {
      setIsPending(true)  // bật cờ báo đang làm việc với firebase

      try {
        /** Component 'url' chứa địa chỉ gọi API, VD: /api/products */
        const response = await axios.get(`/api/${collection}/${id}`)
        

        setIsPending(false)   // clear cờ báo đang làm việc với database
        if (response.data) {  // Nếu response có dữ liệu
          setDocument({ ...response.data, id }) // Cập nhật state 'document' với dữ liệu trả về từ MongoDB.
          setError(null)      // Xóa lỗi cũ (nếu có)
        } else {              // Nếu không có dữ liệu (null hoặc undefined), báo lỗi: document không tồn tại.
          setError("No such document exists")
        }
      } catch (err) {   // Nếu xảy ra lỗi trong quá trình gọi API:
        setIsPending(false)         // clear cờ báo đang làm việc với database
        console.log(err.message)    // log lỗi
        setError("Failed to get document")// Cập nhật state 'error' với thông báo lỗi.
      }
    }

    /** Hàm để lấy dữ liệu từ document từ firestore */
    const fetchDocument2 = () => {
      try {
        /** component liên kết với document có id 'id' trong collection 'collection' */
        const ref = doc(projectFirestore, collection, id)

        /** hàm theo dõi liên tục (onSnapshot) document, nếu có thay đổi trả về 'snapshot' 
         * @unsubscribe     component để clear function khi component cha mất liên kết
         */
        unsubscribe = onSnapshot(ref, (snapshot) => {
          /** nếu có dữ liệu, update component 'document' và clear lỗi */
          if(snapshot.data()) {
            setDocument({...snapshot.data(), id: snapshot.id})
            setError(null)
          }
          else {        // không có dữ liệu, báo lỗi
            setError('No such document exists')
          }
        }, err => {     // nếu onSnapshot lỗi, báo lỗi
          console.log(err.message)
          setError('failed to get document')
        })
      } catch (err) {   // Nếu xảy ra lỗi trong quá trình gọi API:
        console.log(err.message)          // log lỗi
        setError("Failed to get document")// Cập nhật state 'error' với thông báo lỗi.
      }
    }

    /** Gọi hàm fetchDocument khi useEffect chạy lần đầu hoặc khi các dependency thay đổi */
    if(typeDB === false) {
      fetchDocument2();
    } else {
      fetchDocument1();
    }

    /** Gọi hàm cleanup, unsubscribe khi mất kết nối */
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }

  }, [collection, id, typeDB])

  return { document, isPending, error }
}

