/**
 * @title     Firebase config file
 * @brief     File contain firebase's config
 * @filename  config.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Fireabse component */
import firebase from 'firebase/app'
import 'firebase/firestore'                           // dịch vụ hỗ trợ lưu trữ 
import 'firebase/auth'                                // dịch vụ xác minh người dùng




/** -------------------------------------------------------------------------- 
  @COMPONENT -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Component object chứa các config để đăng ký truy cập firebase
 * @apiKey
 * @authDomain
 * @projectId
 * @storageBucket
 * @messagingSenderId
 * @appId
 */
const firebaseConfig = {
  apiKey: "AIzaSyC8LLLF3YsQSJU0-A0OU2wh4mrW9lj614w",
  authDomain: "mymoney-9106f.firebaseapp.com",
  projectId: "mymoney-9106f",
  storageBucket: "mymoney-9106f.firebasestorage.app",
  messagingSenderId: "940236091470",
  appId: "1:940236091470:web:613b93b4d0768dd803531f"
};

/** gọi hàm khởi tạo kết nối firebase sử dụng các config trong component firebaseConfig */
firebase.initializeApp(firebaseConfig)

/** component kết nối với dịch vụ lưu trữ (firestore) của firebase */
const projectFirestore = firebase.firestore()

/** component kết nối với dịch vụ xác minh người dùng (authentication) của firebase */
const projectAuth = firebase.auth()

/** component kết nối với timestamp của dịch vụ lưu trữ (firestore) của firebase  */
const timestamp = firebase.firestore.Timestamp

/** export component ra ngoài */
export { projectFirestore, projectAuth, timestamp }





