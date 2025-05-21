/**
 * @title     Home page
 * @brief     Component home page of MyMoney project
 * @filename  Home.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hooks */
import { useAuthContext } from '../../hooks/useAuthContext' // Hooks để sủ dụng context chứa xác minh người dùng
import { useCollection } from '../../hooks/useCollection'   // Hooks liên kết collection trên database của firebase
/** Custom components */
import TransactionForm from './TransactionForm'             // Transaction form
import TransactionList from './TransactionList'             // Transaction list

/** Styles */
import styles from './Home.module.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/**   Home page component
 * @coponent    Home
 * @returns     None
 */
export default function Home() {

  /** object gồm các component xử lý xác minh người dùng 
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()

  /** object gồm các component liên kết collection trên database của firebase
   * @documents component chứa các documents của collection
   * @error     component chuỗi ký tự báo lỗi
   */
  const { documents, error } = useCollection(
    'transactions',           // tên collection
    ["uid", "==", user.uid],  // chỉ tìm các documents của user.uid
    ['createdAt', 'desc']     // sắp xếp theo thời gian tạo giảm dần 
  )

  return (
    /** thẻ div đại diện home page 
     *   @class sử dụng styles "container"
     */
    <div className={styles.container}>

      {/** thẻ div đại diện component transaction list
        *  @class sử dụng styles "content"
        */}
      <div className={styles.content}>
        {/** thẻ p hiển thị lỗi nếu có lỗi */}
        {error && <p>{error}</p>}
        {/** nếu có dữ liệu của collection giao dịch, hiển thị TransactionList component 
         * @transactions  components chứa các giao dịch 
        */}
        {documents && <TransactionList transactions={documents} />}
      </div>

      {/** thẻ div đại diện component transaction form
        *  @class sử dụng styles "sidebar"
        */}
      <div className={styles.sidebar}>
        {/**  Transaction component
          *  @uid   user id sử dụng transaction form
          */}
        <TransactionForm uid={user.uid} />
      </div>
    </div>
  )
}

