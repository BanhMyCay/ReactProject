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
import { useState, useEffect } from "react";

import styles from "./Home.module.css";

import { FaShoppingCart } from "react-icons/fa";

import { useFirestore } from "../../hooks/useFirestore";

/** Custom hooks */
import { useFetchData } from "../../hooks/useFetchData"; // hooks sử dụng dịch vụ firestore của firebase
import { timestamp } from "../../firebase/config";

/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/**   Transaction form component
 * @uid     user id sử dụng transaction form
 * @returns None
 */
export default function ProductionForm({ uid, myCart }) {
  const { data, isPending, error } = useFetchData("/api/products");
  const { updateDocument, response: updateResponse } =
    useFirestore("transactions");
  const { addDocument, response: addResponse } = useFirestore("transactions");

  const handleAddToCart = async (product) => {
    let quantity = 0;
    for (let i = 0; i < myCart.length; i++) {
      if (myCart[i].productId == product.productId) {
        quantity = 1;
      }
    }
    if (quantity == 0) {
      alert(`✅ Added "${product.title}" into your cart!`);
      const createdAt = timestamp.fromDate(new Date());
      await addDocument({
        uid: uid,
        productId: product.productId,
        name: product.title,
        price: product.price,
        quantity: 1,
        image: product.image,
        clickTime:
          createdAt.seconds * 1000 +
          (createdAt.nanoseconds / 1000000).toFixed(0),
      });
    } else {
      alert(`✅ "${product.title}" already in your cart!`);
    }
  };
  return (
    <div>
      {isPending && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data &&
        data.map((product) => (
          <div className={styles.product} key={product.productId}>
            <img
              src={product.image[0]}
              alt={product.name}
              onClick={() => handleAddToCart(product)}
            />
            <h3>{product.title}</h3>
            <p>Price: ${product.price}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className={styles.buyButton}
            >
              Add to <FaShoppingCart />{" "}
            </button>
          </div>
        ))}
    </div>
  );
}
