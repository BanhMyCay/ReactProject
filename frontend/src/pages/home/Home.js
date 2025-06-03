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
import { useAuthContext } from "../../hooks/useAuthContext"; // Hooks để sủ dụng context chứa xác minh người dùng
import { useCollection } from "../../hooks/useCollection"; // Hooks liên kết collection trên database của firebase
/** Custom components */
import ProductionForm from "./ProductionForm"; // Transaction form
import TransactionList from "./TransactionList"; // Transaction list
import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";

/** Styles */
import styles from "./Home.module.css";

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
  const { user } = useAuthContext();

  /** object gồm các component liên kết collection trên database của firebase
   * @documents component chứa các documents của collection
   * @error     component chuỗi ký tự báo lỗi
   */
  const { documents, error } = useCollection(
    "transactions", // tên collection
    ["uid", "==", user.uid] // chỉ tìm các documents của user.uid
    // ["createdAt", "desc"] // sắp xếp theo thời gian tạo giảm dần
  );
  const { addDocument, response: addResponse } = useFirestore("transactions");
  const { deleteDocument, response: deleteResponse } =
    useFirestore("transactions");
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const fetchCart = () => {
      setCartItems(documents);
    };
    fetchCart();
  }, []);

  const replaceItem = async (item, newQuantity) => {
    // 1. Xoá document cũ
    await deleteDocument(item.id);

    // 2. Thêm document mới
    const newId = await addDocument(
      {
        uid: item.uid,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: newQuantity,
        image: item.image,
        clickTime: item.clickTime,
      }
      //item.clickTime
    );
    // for(let i = 0;i<setCartItems.length;i++){
    //   if(setCartItems[i].id === item.id)
    // }

    // 3. Cập nhật lại state với item mới
    setCartItems(
      (prev) =>
        prev &&
        prev.map((i) =>
          i.id === item.id ? { ...item, id: newId, quantity: newQuantity } : i
        )
    );
  };
  console.log("rerender home");
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
        {documents && (
          <TransactionList myCart={documents} onReplaceItem={replaceItem} />
        )}
      </div>

      {/** thẻ div đại diện component transaction form
       *  @class sử dụng styles "sidebar"
       */}
      <div>
        {/**  Transaction component
         *  @uid   user id sử dụng transaction form
         */}
        <strong>Product list</strong>
        <ProductionForm uid={user.uid} myCart={documents} />
      </div>
    </div>
  );
}
