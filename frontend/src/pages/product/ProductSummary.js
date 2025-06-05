/**
 * @title     Product page (ProductSummary)
 * @brief     Component productSummary của Product page of My Store project
 * @filename  ProductSummary.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      04/06/2025
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React route component (useNavigate) */
import { useNavigate } from 'react-router-dom'

/** Custom hooks */
import { useMongoDB } from "../../hooks/useMongoDB"         // hooks để sử dụng dịch vụ database của mongoDB
import { useFirestore } from "../../hooks/useFirestore"     // hooks để sử dụng dịch vụ firestore của firebase
import { useAuthContext } from "../../hooks/useAuthContext" // hooks để sủ dụng context chứa xác minh người dùng
import { useCollection } from '../../hooks/useCollection'   // hooks liên kết 1 collection trên firestore của firebase
import { useMyCart } from "../../hooks/useMyCart"           // hooks để làm việc với giỏ hàng của user

/** React icon components */
import { 
  FaShoppingCart // icon giỏ hàng
} from "react-icons/fa";

/** Styles */
import './Product.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** ProductSummary của Product page component 
 * @Arg1  product - component chứa thông tin của product  
 */
export default function ProjectSummary({ product }) {
  /** object chứa các component liên kết với hooks sử dụng dịch vụ firestore với collection 'products' 
   * @deleteDocument  hàm xóa một mục document
   */ 
  const { deleteDocument: deleteProduct } = useMongoDB('products')

  /** object chứa các component liên kết với hooks sử dụng dịch vụ firestore với collection 'users' 
   * @updateDocument  hàm sửa một mục document
   */ 
  const { updateDocument: updateMyCart } = useFirestore('users')

  /** object gồm các component liên kết với hooks để sủ dụng context chứa xác minh người dùng
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()

  /** object gồm các component liên kết với hooks để làm việc với giỏ hàng của user
   * @addProductToCart    Hàm thêm sản phẩm vào giỏ hàng
   * @updateProductToCart Hàm sửa số lượng sản phẩm trong giỏ hàng
   */
  const { addProductToCart } = useMyCart()

  /** object chứa các components liên kết với hooks để sử dụng document có id 'id' của 
   *  collection 'products' trên firestore của firebase 
   * @documents component liên kết với collection
   */
  const { documents: userCollection } = useCollection('users')

  /** component liên kết với hook (useNavigate) để chuyển hướng URL */
  const navigate = useNavigate()

  /** hàm xử lý khi ấn nút xóa product */
  const handleClick = async () => {
    try {
      /** hàm xóa một mục document với id 'product.id' */
      await deleteProduct(product.id)
      
      /** Duyệt tất cả người dùng để xóa sản phẩm khỏi giỏ hàng nếu có  */
      userCollection?.forEach(async (doc) => {
        const cart = doc.myCart || [] // component chứa tạm giỏ hàng
        const updatedCart = cart.filter(item => item.id !== product.id) // lọc sản phẩm cần xóa
        /* Nếu có thay đổi (tức là sản phẩm tồn tại trong cart), thực hiện xóa sản phẩm */
        if (updatedCart.length !== cart.length) {
          await updateMyCart(doc.id, {myCart: updatedCart})
        }
      })

      /** chuyển hướng URL về page mặc định */
      navigate('/')
    } catch (err) { // có lỗi khi làm việc với database, log lại lỗi
      console.log(err)
    }


  }

  /** hàm xử lý khi ấn thêm product */
  const handleAddToCart = async () => {
    /** Hàm thêm sản phẩm vào giỏ hàng
     * @Arg1  product - object thông tin sản phẩm cần thêm
     */
    await addProductToCart(product)
  }

  return (
    /** thẻ div đại diện ProductSummary */
    <div>
      {/** thẻ div đại diện ProductSummary 
       *   @class
       */}
      <div className="product-summary">
        {/** thẻ img chứa ảnh của product 
         *   @src - link ảnh        @alt - chú thích ảnh
         */}
        <img src={product.image[0]} alt={product.name} />

        {/** thẻ h2 chứa tiêu đề của product 
         *  @class
         */}
        <h2 className="page-title">{product.name}</h2>
        
        {/** thẻ p chứa thông tin của product */}
        <p> {product.details} </p>

        {/** thẻ p chứa giá của product */}
        <p>Price: ${product.price}</p>

        {/** thẻ button thêm sản phẩm vào giỏ hàng
          *     @click_handle                            @class
          */}
        <button onClick={() => handleAddToCart()} className="add">Add to <FaShoppingCart /></button>
      </div>

      {/** thẻ button để xóa product, chỉ người tạo product mới có thể xóa
       *        @class          @handleClick
       */}
      {user.uid === product.createdBy.id && (
        <button className="btn" onClick={handleClick}>Delete product</button>
      )}

    </div>
  )
}