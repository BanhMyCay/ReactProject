/**
 * @title     useCollection hook
 * @brief     Custom hooks (useCollection) liên kết collection trên database của firebase
 * @filename  useCollection.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components (useEffect, useState, useRef) */
import { useEffect, useState, useRef } from "react"

/** Firebase component (firestore) */
import { projectFirestore } from "../firebase/config"
import { 
  collection, 
  query as queryFn, 
  where, 
  orderBy as orderByFn, 
  onSnapshot 
} from "firebase/firestore";


/** -------------------------------------------------------------------------- 
  @CUSTOM_HOOK_FUNCTIONS -----------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hook (useCollection) liên kết collection trên database của firebase
 * @Arg1  collection    - component chứa tên collection cần sử dụng
 * @Arg2  _query        - array chứa yêu cầu properties để truy vấn cụ thể documents của collection
 * @Arg3  _orderBy      - array chứa yêu cầu properties để truy vấn thời gian tạo cụ thể của documents
 * @Ret1  documents     - component chứa các documents của collection
 * @Ret2  error         - component chuỗi ký tự báo lỗi
 */
export const useCollection = (colName, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null)              // component chứa các documents của collection
  const [error, setError] = useState(null)                      // component chuỗi ký tự báo lỗi

  /** component thay thế array (useRef) để khi sử dụng useEffect không tạo vòng lập tuần hoàn
   *  _query là một array, mỗi lần re-evaluate sẽ tạo mới ở địa chỉ khác của bộ nhớ */ 
  const query = useRef(_query).current
  const orderBy = useRef(_orderBy).current

  /**   hook useEffect để giảm sát khi có thay đổi dữ liệu trong collection
   * @dependency1   collection  - component chứa tên collection cần sử dụng
   * @dependency2   query       - component thay thế object _query
   * @dependency3   orderBy     - component thay thế object _orderBy
   */
  useEffect(() => {
    /** component kết nối với collection sử dụng dịch vụ firestore */
    let ref = collection(projectFirestore, colName)

    /** Tạo mảng điều kiện để truyền vào hàm query */
    const constraints = [];
    
    /** yêu cầu properties, truy vấn cụ thể các documents thỏa mãn yêu cầu  */
    if (query) {                // chỉ tìm các documents có properties (...query)
      constraints.push(where(...query));
    }
    if (orderBy) {              // sắp xếp theo trường (...orderBy)
      constraints.push(orderByFn(...orderBy));
    }

    /** Tạo query với các constraints */
    if (constraints.length > 0) {
      ref = queryFn(ref, ...constraints);
    }

    /** gọi hàm giám sát collection (onSnapshot) ,trả về @object 'snapshot' mỗi khi có sự 
     *  thay đổi collection trên firebase, rồi xử lý hàm bên trong (khi refresh trang cũng 
     *  tạo 1 snapshot) 
     * @unsubscribe     component liên kết với return của hàm để tạo cleanup khi component cha
     *                  mất kết nối
     */ 
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      // component tạm thời
      let results = []

      /**   hàm quét từng documents nhận được từ firestore và push vào component tạm thời */
      snapshot.docs.forEach(doc => {
        console.log(doc)
        results.push({...doc.data(), id: doc.id})
      });
      
      setDocuments(results)     // update component chứa các documents của collection
      setError(null)            // clear lỗi
    }, error => {               // lỗi khi đang onSnapshot
      console.log(error)        // log lỗi
      setDocuments(null)         // clear component chứa các documents của collection
      setError('could not fetch the data')  // báo lỗi
    })

    /** Gọi hàm cleanup, unsubscribe khi mất kết nối */
    return () => unsubscribe()

  }, [colName, query, orderBy])

  return { documents, error }
}