/**
 * @title     Cart user bar
 * @brief     Component Cart user bar for page components
 * @filename  CartUsers.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



 /** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components */
import { 
  useEffect,  // hooks xử lý side effects (chạy code phụ trợ sau khi component render)
  useState,   // hooks lưu trữ và cập nhật state
  useRef 
} from "react"

/** Custom hooks */
import { useDocument } from '../hooks/useDocument'        // hooks liên kết 1 document trên firestore của firebase
import { useAuthContext } from '../hooks/useAuthContext'  // hooks sủ dụng context chứa xác minh người dùng
import { useMyCart } from "../hooks/useMyCart"           // hooks để làm việc với giỏ hàng của user

/** Styles */
import './CartUsers.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Cart user bar component */
export default function CartUsers() {
  /** object gồm các component xử lý xác minh người dùng
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()

  /** object gồm các component liên kết collection trên database của firebase
   * @documents     component chứa các documents của collection
   * @error         component chuỗi ký tự báo lỗi
   * @isPending     cờ báo đang làm việc với database
   */
  const { isPending, error, document } = useDocument('users', user.uid)

  /** object gồm các component liên kết với hooks để làm việc với giỏ hàng của user
   * @updateProductToCart  Hàm sửa số lượng sản phẩm trong giỏ hàng 
   * @removeProductToCart  Hàm xóa 1 sản phẩm khỏi giỏ
   */
  const { updateProductToCart, removeProductToCart } = useMyCart()

  const cart = document?.myCart || [] // component giỏ hàng mặc định tránh lỗi NULL
  const CartRef = useRef(cart).current;

  const [quantities, setQuantities] = useState({}) // component chứa số lượng sản phẩm của các mặt hàng

  /** Cập nhật quantities mỗi khi giỏ hàng thay đổi 
   * @dependency1:  cart - giỏ hàng 
   */ 
  useEffect(() => {
    const initialQuantities = {}  // component chứa tạm số lượng sản phẩm của các mặt hàng
    CartRef.forEach(item => {     // quét từng mặt hàng trong giỏ hàng và lưu lại
      initialQuantities[item.id] = item.quantity
    })
    setQuantities(initialQuantities)  // lưu lại số lượng sản phẩm các mặt hàng
  }, [CartRef]);

  /** hàm xử lý khi người dùng nhấn Enter trong input số lượng 
   * @Arg1  e     - sự kiện nút nhấn
   * @Arg2  item  - object thông tin sản phẩm 
   */
  const handleQuantityChange = (e, item) => {
    if (e.key === 'Enter') {
      const rawValue = e.target.value.trim()
      const newQuantity = parseInt(rawValue, 10)

      /** Giá trị không hợp lệ, reset về số lượng cũ */
      if (isNaN(newQuantity) || newQuantity < 0 || newQuantity > 99) {
        setQuantities(prev => ({ ...prev, [item.id]: item.quantity }))
        return
      }

      /** Giá trị hợp lệ, update số lượng sản phẩm mới */
      if (newQuantity !== item.quantity) {
        updateProductToCart(item.id, newQuantity)
      }
    }
  }

  /** hàm xử lý khi người dùng nhấn phím tăng số lượng hàng hóa
   * @Arg1  item  - object thông tin sản phẩm 
   */
  const handlePlus = (item) => {
    /** component lưu tạm số lượng sản phẩm khi tăng và giới hạn max 99 */
    const current = quantities[item.id] || item.quantity
    const updated = Math.min(current + 1, 99)

    /** lưu lại số lượng sản phẩm vào component và database */
    setQuantities(prev => ({ ...prev, [item.id]: updated }))
    updateProductToCart(item.id, updated)
  }

  /** hàm xử lý khi người dùng nhấn phím giảm số lượng hàng hóa
   * @Arg1  item  - object thông tin sản phẩm 
   */
  const handleMinus = (item) => {
    /** component lưu tạm số lượng sản phẩm khi tăng và giới hạn min 0 */
    const current = quantities[item.id] || item.quantity
    const updated = Math.max(current - 1, 0)
    
    /** lưu lại số lượng sản phẩm vào component và database */
    setQuantities(prev => ({ ...prev, [item.id]: updated }))
    updateProductToCart(item.id, updated)
  }

  /** hàm xử lý khi ô input thay đổi
   * @Arg1  e     - sự kiện nút nhấn
   * @Arg2  item  - object thông tin sản phẩm 
   */
  const handleInputChange = (e, item) => {
    const rawValue = e.target.value   // lấy giá trị hiện tại người dùng nhập trong ô input
    
    /** đảm bảo ô input 2 chữ số  */
    if (!/^\d{0,2}$/.test(rawValue)) return   

    /** cập nhập ô input nếu số hợp lệ */
    setQuantities(prev => ({ ...prev, [item.id]: rawValue }))
  }

  return (
    /** thẻ div đai diện user bar 
     *   @class
    */
    <div className="cartContainer">
      {/** thẻ h2 chứa tiêu đề của bar */}
      <h2>My cart</h2>

      {/** thẻ div khi đang làm việc với firebase */}
      {isPending && <div>Loading carts...</div>}

      {/** thẻ di báo lỗi khi làm việc với firebase */}
      {error && <div>{error}</div>}

      {/** thẻ ul để li tất cả hàng hóa trong giỏ hàng
        *  @class 
        */}
      <ul className="cartList">
        {/** map từng hàng hóa trong giỏ hàng, chỉ hoạt động khi có giỏ hàng
          *  @key id của hàng hóa tuonwng ứng 
          */}
        {cart && cart.map((item) => ( 
          <li key={item.id} className="cartItem">
            {/** thẻ img chứa ảnh của sản phẩm
              *  @src - link ảnh  @alt - mô tả    @class - css
              */}
            <img src={item.image} alt={item.name} className="productImage" />

            {/** thẻ div dại diện thông tin hàng hóa trong giỏ
              *  @class - css
              */}
            <div className="details">
              {/** thẻ p chứa tên sản phẩm
                *@class - css
                */}
              <p className="name">{item.name}</p>
              {/** thẻ div đại diện tổ hợp điều khiển số lượng sản phẩm
                *  @class - css
                */}
              <div className="quantityControl">
                {/** thẻ button giảm đơn vị sản phẩm đi 1 */}
                <button onClick={() => handleMinus(item)}>–</button>
                
                {/** thẻ iput điều khiển số lượng sản phẩm */}
                <input
                  type="number"               // loại input number
                  className="quantityInput"   // class: css
                  value={quantities[item.id] ?? item.quantity}  // giá trị của ô input
                  min="0"   // giá trị min của ô input
                  max="99"  // giá trị max của ô input
                  onKeyDown={(e) => handleQuantityChange(e, item)}  // hàm xử lý khi nhấn nút
                  onChange={(e) => handleInputChange(e, item)}      // hàm xử lý khi input thay đổi
                  onBlur={() => {   // hàm xử lý khi không chọn ô input, reset về giá trị cũ
                    setQuantities(prev => ({
                      ...prev,
                      [item.id]: item.quantity
                    }))
                  }}
                />
                
                {/** thẻ button tăng đơn vị sản phẩm lên 1 */}
                <button onClick={() => handlePlus(item)}>+</button>
              </div>
            </div>

            <p className="amount"> ${(item.price * item.quantity).toLocaleString()}</p>

            <button onClick={() => {removeProductToCart(item.id)}} className="deleteButton">
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

      <div className="totalCostBox">
        <span>💰 Total cost:</span>
        <strong>
          $
          {cart && cart
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toLocaleString()}{" "}
        </strong>
      </div>
      
    </div>
  )
}