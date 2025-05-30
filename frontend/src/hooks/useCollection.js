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
/** React components */
import { 
  useEffect,  // hooks xử lý side effects (chạy code phụ trợ sau khi component render)
  useState,   // hooks lưu trữ và cập nhật state
  useRef      // hooks ham chiếu đến DOM hoặc giữ giá trị không làm re-render
} from "react"

/** Axios component */
import axios from "axios";  // thư viện HTTP client giúp bạn gửi request và nhận response từ một server             



/** -------------------------------------------------------------------------- 
  @CUSTOM_HOOK_FUNCTIONS -----------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hook (useCollection) liên kết collection trên database của firebase
 * @Arg1  collection    - component chứa tên collection cần sử dụng
 * @Arg2  _query        - array chứa yêu cầu properties để lọc documents của collection
 * @Arg3  _orderBy      - array chứa yêu cầu properties để sắp xếp documents
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
    /** Hàm để lấy dữ liệu từ collection của backend
     * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
     */
    const fetchCollection = async () => {
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

        /** Gửi GET request đến API, phản hổi lưu vào component 'response' */
        const response = await axios.get(url);

        /** Nếu thành công: cập nhật state 'documents' bằng dữ liệu nhận được và Xóa lỗi trước đó nếu có */
        setDocuments(response.data);
        setError(null);
      } catch (err) {       // Nếu lỗi xảy ra khi gọi API:
        console.log(err);   // log lỗi
        setError("Could not fetch the data from MongoDB API."); // báo lỗi
        setDocuments(null); // Xóa dữ liệu hiện có (nếu có).
      }
    };

    /** Gọi hàm fetchCollection khi useEffect chạy lần đầu hoặc khi các dependency thay đổi */
    fetchCollection();

  }, [colName, query, orderBy])

  return { documents, error }
}