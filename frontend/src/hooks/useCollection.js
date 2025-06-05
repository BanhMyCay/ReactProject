/**
 * @title     useCollection hook
 * @brief     Custom hooks (useCollection) liên kết collection trên database của firebase
 * @filename  useCollection.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      02/06/2025
 */

/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components */
import { 
  useEffect,  // hooks xử lý side effects (chạy code phụ trợ sau khi component render)
  useState,   // hooks lưu trữ và cập nhật state
  useRef      // hooks ham chiếu đến DOM hoặc giữ giá trị không làm re-render
} from "react"

/** Firebase component */
import { projectFirestore } from "../firebase/config"   // component kết nối với dịch vụ database (firestore) của firebase
import {            
  collection,               // Tham chiếu đến một collection trong Firestore.
  query as queryFn,         // Tạo truy vấn.
  where,                    // Điều kiện lọc
  orderBy as orderByFn,     // Sắp xếp kết quả
  onSnapshot                // Lắng nghe sự thay đổi dữ liệu realtime.
} from 'firebase/firestore' // dịch vụ database (firestore) của firebase

/** Backend API modules */   
import axios from "axios";  // Axios modules, HTTP client, giúp gửi các request (GET, POST, PUT, DELETE,...) đến server khác.



/** -------------------------------------------------------------------------- 
  @CUSTOM_HOOK_FUNCTIONS -----------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hook (useCollection) liên kết collection trên database của firebase
 * @Arg1  collection  - component chứa tên collection cần sử dụng
 * @Arg2  _query      - array chứa yêu cầu properties để lọc documents của collection
 * @Arg3  _orderBy    - array chứa yêu cầu properties để sắp xếp documents
 * @Arg4  typeDB      - loại database (false-firestore/true-mongoDB)
 * @Ret1  documents   - component chứa các documents của collection
 * @Ret2  isPending - component cờ báo đang làm việc với database
 * @Ret3  error       - component chuỗi ký tự báo lỗi
 */
export const useCollection = (colName, _query, _orderBy, typeDB = false) => {
  const [documents, setDocuments] = useState(null)  // component chứa các documents của collection
  const [error, setError] = useState(null)          // component chuỗi ký tự báo lỗi
  const [isPending, setIsPending] = useState(false) // component cờ báo đang làm việc với database

  /** component thay thế array (useRef) để khi sử dụng useEffect không tạo vòng lập tuần hoàn
   *  _query là một array, mỗi lần re-evaluate sẽ tạo mới ở địa chỉ khác của bộ nhớ 
   */
  const query = useRef(_query).current
  const orderBy = useRef(_orderBy).current

  /**   hook useEffect để giảm sát khi có thay đổi dữ liệu trong collection
   * @dependency1   collection  - component chứa tên collection cần sử dụng
   * @dependency2   query       - component thay thế object _query
   * @dependency3   orderBy     - component thay thế object _orderBy
   */
  useEffect(() => {
    /** Component liên kết với return của hàm "onSnapshot" của firestore */
    let unsubscribe;

    /** Hàm để lấy dữ liệu collection từ backend
     * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
     */
    const fetchCollection1 = async () => {
      setIsPending(true)  // bật cờ báo đang làm việc với firebase

      try {
        /** Component 'url' chứa địa chỉ gọi API, VD: /api/products */
        let url = `/api/${colName}`;
        
        /** Component 'params' giúp tạo chuỗi truy vấn dạng ?key=value */
        const params = new URLSearchParams();

        /** yêu cầu properties, lọc cụ thể các documents thỏa mãn yêu cầu  */
        if (query && query.length === 2) {      // chỉ tìm các documents có properties 
          params.append(query[0], query[1]);    // [key, value] - VD: ?category=books
        }
        if (orderBy && orderBy.length === 2) {  // sắp xếp dữ liệu 
          params.append("sort", orderBy[0]);    // [sort, value] - VD: ?sort=createdAt
          params.append("direction", orderBy[1]);// [sordirection, value] - VD: ?direction=desc
        }

        /** Gắn chuỗi query params vào 'url' để lọc documents nếu có bất kỳ tham số nào */
        if ([...params].length > 0) {
          url += "?" + params.toString();
        }

        /** Gửi GET request đến API, phản hổi lưu vào component "response" */
        const response = await axios.get(url);
        const data = response.data; // lấy dữ liệu collection từ "response"
        
        /** Nếu thành công: cập nhật state 'documents' bằng dữ liệu nhận được và Xóa lỗi trước đó nếu có */
        setDocuments(data);
        setIsPending(false) // clear cờ báo đang làm việc với database
        setError(null);
      } catch (err) {       // Nếu lỗi xảy ra khi gọi API:
        console.log(err);   // log lỗi
        setIsPending(false) // clear cờ báo đang làm việc với database
        setError("Could not fetch the data from MongoDB API."); // báo lỗi
        setDocuments(null); // Xóa dữ liệu hiện có (nếu có).
      }
    };

    /** Hàm để lấy dữ liệu collection từ firebase */
    const fetchCollection2 = () => {
      try {
        /** Hàm kết nối với collection ("collection") trên firestore 
         * @Arg1  Component liên kết với dịch vụ firestore
         * @Arg2  Tên collection
         * @Ret1  Ref - 
         */
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
        unsubscribe = onSnapshot(ref, (snapshot) => {
          // component tạm thời
          let results = []

          /**   hàm quét từng documents nhận được từ firestore và push vào component tạm thời */
          snapshot.docs.forEach(doc => {
            console.log(doc)
            results.push({...doc.data(), id: doc.id})
          });
          
          setDocuments(results) // update component chứa các documents của collection
          setError(null)        // clear lỗi
        }, (error) => {         // lỗi khi đang onSnapshot
          console.log(error)    // log lỗi
          setDocuments(null)    // clear component chứa các documents của collection
          setError('could not fetch the data')  // báo lỗi
        })
      } catch (error) {     // lỗi khi đang init firestore, log và báo lỗi  
        console.log(error)
        setError('Error initializing Firestore query.')
      }
    }

    /** Gọi hàm fetchCollection khi useEffect chạy lần đầu hoặc khi các dependency thay đổi */
    if(typeDB === false) {
      fetchCollection2();
    } else {
      fetchCollection1();
    }

    /** Gọi hàm cleanup, unsubscribe khi mất kết nối */
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }

  }, [colName, query, orderBy, typeDB])

  return { documents, isPending, error }
}