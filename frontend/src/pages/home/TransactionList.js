/**
 * @title     Transaction list
 * @brief     Component transaction list for home page components
 * @filename  TransactionList.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      03/06/2025
 */

/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hooks */
import { useFirestore } from "../../hooks/useFirestore"; // hooks sử dụng dịch vụ firestore của firebase

import { useState, useEffect } from "react";

/** Styles */
import styles from "./Home.module.css";

/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/**   Transaction list component
 * @transactions    components chứa các giao dịch
 */
export default function TransactionList({ myCart = [], onReplaceItem }) {
  /** object gắn với return của hooks sử dụng dịch vụ firestore của firebase
   * @deleteDocument  hàm xóa một mục document
   */

  const { deleteDocument } = useFirestore("transactions");
  const { updateDocument } = useFirestore("transactions");
  const handleIncrease = (item) => {
    const newQuantity = item.quantity + 1;
    onReplaceItem(item, newQuantity);
  };

  const handleDecrease = (item) => {
    const newQuantity = Math.max(1, item.quantity - 1);
    onReplaceItem(item, newQuantity);
  };
  console.log("rerender my cart");
  myCart.sort((a, b) => b.clickTime - a.clickTime);
  return (
    /** thẻ ul để li tất cả giao dịch
     *  @class để style "transactions"
     */

    <div className={styles.cartContainer}>
      <strong>My cart</strong>
      <ul className={styles.cartList}>
        {myCart.map((item) => (
          <li key={item.productId} className={styles.cartItem}>
            <img
              src={item.image[0]}
              alt={item.title}
              className={styles.productImage}
            />

            <div className={styles.details}>
              <p className={styles.name}>{item.name}</p>

              <div className={styles.quantityControl}>
                <button
                  onClick={() => handleDecrease(item)}
                  disabled={item.quantity <= 1}
                >
                  –
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncrease(item)}>+</button>
              </div>
            </div>

            <p className={styles.amount}>
              ${(item.price * item.quantity).toLocaleString()}
            </p>

            <button
              onClick={() => deleteDocument(item.id)}
              className={styles.deleteButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.totalCostBox}>
        <span>💰 Total cost:</span>
        <strong>
          $
          {myCart
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toLocaleString()}{" "}
        </strong>
      </div>
    </div>
  );
}
