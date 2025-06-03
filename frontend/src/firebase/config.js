/**
 * @title     Firebase config file
 * @brief     File contain firebase's config
 * @filename  config.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      02/06/2025
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Fireabse component */
import { initializeApp } from 'firebase/app';         // hàm kết nối với App trên firebase
import { getAuth } from 'firebase/auth';              // hàm đăng ký dịch vụ xác minh người dùng
import { getFirestore } from 'firebase/firestore';    // hàm đăng ký dịch vụ lưu trữ collection
import { Timestamp } from 'firebase/firestore';       // hàm sử dụng thời gian thực của dịch vụ lưu trữ collection
import { getStorage } from 'firebase/storage';        // hàm sử dụng dịch vụ lưu trữ file



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
  apiKey: "AIzaSyDA1kCueAesR33DiZ4togw8zcqkxi2NJAc",
  authDomain: "mystore-3d880.firebaseapp.com",
  projectId: "mystore-3d880",
  storageBucket: "mystore-3d880.firebasestorage.app",
  messagingSenderId: "444817007576",
  appId: "1:444817007576:web:cafcffb0a4e18e603548ad"
};

/** component 'app' kết nối App để đăng ký các dịch vụ trên firebase */
const firebase = initializeApp(firebaseConfig)

/** component kết nối với dịch vụ lưu trữ (firestore) của firebase */
const projectFirestore = getFirestore(firebase)

/** component kết nối với dịch vụ xác minh người dùng (authentication) của firebase */
const projectAuth = getAuth(firebase)

/** component kết nối với timestamp của dịch vụ lưu trữ (firestore) của firebase  */
const timestamp = Timestamp

/** component kết nối với dịch vụ lưu trữ file (storage) của firebase */
const projectStorage = getStorage(firebase)

/** export component ra ngoài */
export { projectFirestore, projectAuth, timestamp, projectStorage }





