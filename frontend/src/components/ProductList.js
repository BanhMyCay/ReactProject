/**
 * @title     Product list
 * @brief     Component prodcut list for page prodcut components
 * @filename  ProductList.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React route components */
import { 
  Link    
} from "react-router-dom"

/** React icon components */
import { 
  FaShoppingCart // icon giỏ hàng
} from "react-icons/fa";

/** Styles */
import './ProductList.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Product list component 
 * @Arg1  products  - array chứa các product cần list
 */
export default function ProductList({ products, handleAddToCart }) {
  return (
    /** thẻ div đại diện product list */
    <div className="product-list">
      {/** thẻ p báo không có product */}
      {products.length === 0 && <p>No products yet!</p>}

      {/** map tất cả product trong component 'products' 
       * @key id của product
       */}
      {products.map(product => (
        /** Thẻ div đại diện 1 form của product 
         *   @class 
         */
        <div className="product-form" key={product.id}>
          {/** Link đường dẫn đến product cụ thể theo id cho mỗi product của list */}
          <Link to={`/products/${product.id}`}>
            {/** thẻ img chứa ảnh của product 
             *   @src - link ảnh        @alt - chú thích ảnh
             */}
            <img src={product.image[0]} alt={product.name} />
            
            {/** thẻ h3 chứa tên của product */}
            <h3>{product.name}</h3>
            {/** thẻ p chứa mô tả của product */}
            <p>{product.details.substring(0, 20)}...</p>
            {/** thẻ p chứa giá của product */}
            <p>Price: ${product.price}</p>
          </Link>

          {/** thẻ button thêm sản phẩm vào giỏ hàng
            *     @click_handle                            @class
            */}
          <button onClick={() => handleAddToCart(product)} className="btn">Add to <FaShoppingCart /></button>
        </div>
      ))}
    </div>
  )
}
