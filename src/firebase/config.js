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
import 'firebase/storage'                             // dịch vụ lưu trữ file



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
  apiKey: "AIzaSyD-0_t3KxUi-tuaKCmxF1WVNpwBkEDraW4",
  authDomain: "thedojo-c0b0d.firebaseapp.com",
  projectId: "thedojo-c0b0d",
  storageBucket: "thedojo-c0b0d.firebasestorage.app",
  messagingSenderId: "758484797072",
  appId: "1:758484797072:web:405f16e606784d9a067a15"
};

/** gọi hàm khởi tạo kết nối firebase sử dụng các config trong component firebaseConfig */
firebase.initializeApp(firebaseConfig)

/** component kết nối với dịch vụ lưu trữ (firestore) của firebase */
const projectFirestore = firebase.firestore()

/** component kết nối với dịch vụ xác minh người dùng (authentication) của firebase */
const projectAuth = firebase.auth()

/** component kết nối với timestamp của dịch vụ lưu trữ (firestore) của firebase  */
const timestamp = firebase.firestore.Timestamp

/** component kết nối với dịch vụ lưu trữ file (storage) của firebase */
const projectStorage = firebase.storage()

/** export component ra ngoài */
export { projectFirestore, projectAuth, timestamp, projectStorage }





