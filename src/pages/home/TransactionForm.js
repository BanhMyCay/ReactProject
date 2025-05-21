/**
 * @title     Transaction form
 * @brief     Component transaction form for home page components
 * @filename  TransactionForm.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



 /** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React component (useState, useEffect) */
import { useState, useEffect } from 'react'

/** Custom hooks */
import { useFirestore } from '../../hooks/useFirestore'   // hooks sử dụng dịch vụ firestore của firebase



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/**   Transaction form component
 * @uid     user id sử dụng transaction form
 * @returns None
 */
export default function TransactionForm({ uid }) {
  const [name, setName] = useState('')      // component lưu tạm tên giao dịch
  const [amount, setAmount] = useState('')  // component lưu tạm giá giao dịch

  /** object gắn với return của hooks sử dụng dịch vụ firestore của firebase
   * @addDocument   hàm thêm một mục document
   * @response      object respone của hooks
   */
  const { addDocument, response } = useFirestore('transactions')

  /**   hàm xử lý sự kiện submit khi ấn nút thêm giao dịch
   * @e    sự kiện submit
   */
  const handleSubmit = (e) => {
    e.preventDefault()                      // ngăn xử lý mặc định của sự kiện (reload pages)
    /**   hàm thêm một mục document (giao dịch)
     * @uid     user id sử dụng transaction form
     * @name    component lưu tạm tên giao dịch
     * @amount  component lưu tạm giá giao dịch
     */    
    addDocument({
      uid, 
      name, 
      amount,
    })
  }

  /** hook useEffect để reset form khi thêm một giao dịch thành công */
  useEffect(() => {
    if (response.success) {
      setName('')
      setAmount('')
    }
  }, [response.success])

  return (

    <>
      {/** thẻ h3 chứa tiêu đề của form giao dịch */}
      <h3>Add a Transaction</h3>

      {/** thẻ form chứa khung mẫu giao dịch 
       *    @handleClick
       */}
      <form onSubmit={handleSubmit}>
        {/** thẻ label chứa input tên giao dịch của form */}
        <label>
          {/** thẻ span chứa tiêu đề của input tên giao dịch */}
          <span>Transaction name:</span>
          {/** thẻ input để điền tên giao dịch
           * @type      loại input text
           * @onChange  khi input thay đổi sẽ đặt giá trị components name theo giá trị input
           * @value     giá trị của input thay đổi theo components name
           * @required  bắt buộc có giá trị
          */}
          <input 
            type="text"
            required
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            required
          />
        </label>

        {/** thẻ label chứa input giá giao dịch của form */}
        <label>
          {/** thẻ span chứa tiêu đề của input giá giao dịch */}
          <span>Amount ($):</span>
          {/** thẻ input để điền tên giao dịch
           * @type      loại input number
           * @onChange  khi input thay đổi sẽ đặt giá trị components amount theo giá trị input
           * @value     giá trị của input thay đổi theo components amount
           * @required  bắt buộc có giá trị
          */}
          <input
            type="number"
            required
            onChange={(e) => setAmount(e.target.value)} 
            value={amount} 
          />
        </label>

        {/** thẻ button nút thêm giao dịch */}
        <button>Add Transaction</button>
      </form>

    </>
  )
}