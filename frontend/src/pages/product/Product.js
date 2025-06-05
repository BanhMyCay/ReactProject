/**
 * @title     product page
 * @brief     Component product page of My Store project
 * @filename  Product.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React route components */
import { useParams } from "react-router-dom"

/** Custom hooks */
import { useDocument } from '../../hooks/useDocument'


/** Page components */
import ProductSummary from "./ProductSummary"     // component chứa nội dung của product page
import ProductComments from "./ProductComments"   // component chứa ô comment cho product page


/** Styles */
import './Product.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Product page component */
export default function Product() {
  /** object chứa các component liên kết với hooks (useParams) để lấy thuộc tính 
   *  sau đuôi URL /:<properties> 
   */
  const { id } = useParams()

  /** object chứa các components liên kết với hooks để sử dụng document có id 'id' của 
   *  collection 'products' trên firestore của firebase 
   * @document  component liên kết với document
   * @error     component lỗi khi sử dụng hook
   */
  const { document, error } = useDocument('products', id, true)

  if (error) {    // nếu lỗi trả về thẻ báo lỗi
    return <div className="error">{error}</div>
  }
  if (!document) {// nếu không có documents trả về thẻ báo lỗi
    return <div className="loading">Loading...</div>
  }

  return (
    /** thẻ div đại diện Product page 
     *   @class
     */
    <div className="product-details">
      {/** ProductSummary component hiển thị chi tiêt product */}
      <ProductSummary product={document} />

      {/** ProductComments component để bình luận về product */}
      <ProductComments product={document} />
    </div>
  )
}

