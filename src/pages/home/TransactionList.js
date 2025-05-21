/**
 * @title     Transaction list
 * @brief     Component transaction list for home page components
 * @filename  TransactionList.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */


/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hooks */
import { useFirestore } from '../../hooks/useFirestore'   // hooks sử dụng dịch vụ firestore của firebase

/** Styles */
import styles from './Home.module.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/**   Transaction list component
 * @transactions    components chứa các giao dịch 
 */
export default function TransactionList({ transactions }) {
  /** object gắn với return của hooks sử dụng dịch vụ firestore của firebase
   * @deleteDocument  hàm xóa một mục document
   */
  const { deleteDocument } = useFirestore('transactions')
  
  return (
    /** thẻ ul để li tất cả giao dịch 
     *  @class để style "transactions"
    */
    <ul className={styles.transactions}>
      {/** map đến từng object giao dịch (transaction) trong component transactions 
       * @key   lấy id của object giao dịch
      */}
      {transactions.map((transaction) => (
        <li key={transaction.id}>
          {/** thẻ p hiển thị tên và giá giao dịch 
            * @class để style "name" và "amount"
            */}
          <p className={styles.name}>{transaction.name}</p>
          <p className={styles.amount}>${transaction.amount}</p>

          {/** thẻ button chứa nút nhấn để thực hiện xóa giao dịch
            *     @handleClick
            */}
          <button onClick={() => deleteDocument(transaction.id)}>x</button>
        </li>
      ))}
    </ul>
  )
}