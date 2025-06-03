/**
 * @title     useSignup hook
 * @brief     Custom hooks (useSignup) để thực hiện đăng ký người dùng mới
 * @filename  useFetch.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      03/06/2025
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React hooks */
import {
  useState,     // Tạo các biến trạng thái trong component
  useEffect     // Dùng để xử lý logic side effect khi component được render hoặc update
} from 'react'

/** Firebase component */
import { 
  projectAuth,        // Kết nối tới dịch vụ Firebase Authentication
  projectStorage,     // Kết nối tới dịch vụ Firebase Storage
  projectFirestore    // Kết nối tới dịch vụ Firestore database 
} from '../firebase/config'                
import { 
  createUserWithEmailAndPassword,// Firebase SDK xử lý đăng nhập với email và mật khẩu
  updateProfile       // Firebase SDK xử lý update thông tin tài khoản
} from 'firebase/auth'  
import { 
  doc,      // Tạo tham chiếu đến 1 document trong Firestore
  setDoc    // Cập nhật nội dung của 1 document hiện có trong Firestore
} from 'firebase/firestore'               

/** Custom hooks */
import { useAuthContext } from './useAuthContext'   // Hooks để sủ dụng context chứa xác minh người dùng



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
   * @Arg4  thumbnail   file ảnh avatar
   * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
   */
  const signup = async (email, password, displayName, thumbnail) => { 
    setError(null)              // clear components chuỗi ký tự báo lỗi
    setIsPending(true)          // bật cờ báo đang làm việc với firebase
  
    let photoURL = null         // component chứa URL của ảnh
  
    try {
      /**   hàm tạo tài khoản mới với email và password của dịch vụ firebase authentication
       * @res   component liên kết với thông tin tài khoản trên firebase
       */ 
      const res = await createUserWithEmailAndPassword(projectAuth, email, password)
      console.log(res.user)     // log lại thông tin tài khoản

      if (!res) {               // res null - đăng ký thất bại, báo lỗi
        throw new Error('Could not complete signup')
      }

      /** upload file thumbnails */
      if(thumbnail) { 
        // try {
        //   /** component chứa thông tin folder lưu trữ file */
        //   const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`

        //   /**   hàm up file thumbnail lên storage của firebase
        //    * @img component liên kết với thông tin file up lên storage của firebase
        //    */
        //   const img = await projectStorage.ref(uploadPath).put(thumbnail)

        //   /**   hàm lấy URL của file trên storage của firebase
        //    * @photoURL  component liên kết với URL của file trên storage
        //    */
        //   photoURL = await img.ref.getDownloadURL()
        // } 
        // catch (uploadErr) { // lỗi storage, log lỗi
        //   console.error('Lỗi upload ảnh:', uploadErr.message)
        // }
      }

      /**   hàm cập nhật thông tin tài khoản của dịch vụ firebase authentication
       * @res   component liên kết với thông tin tài khoản trên firebase
       */
      await updateProfile(res.user, { displayName, photoURL })

      /**   hàm tạo document mới với id người tạo trên colection users của firestore với object thuộc tính như sau
       * @online      trạng thái người dùng
       * @displayName tên người dùng
       * @photoURL    link ảnh avatar trên storage của firebase
       */ 
      // create a user document
      await setDoc(doc(projectFirestore, 'users', res.user.uid), { 
        online: true,
        displayName,
        photoURL,
      })

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