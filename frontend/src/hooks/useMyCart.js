/**
 * @title     useMyCart hook
 * @brief     Custom hooks (useMyCart) để làm việc với giỏ hàng của user
 * @filename  useFetch.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      04/06/2025
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React hooks */
import {
  useState,     // Tạo các biến trạng thái trong component
} from 'react'

/** Firebase component */
import { 
  timestamp     // component liên kết với thời gian thực của firebase
} from '../firebase/config'                    

/** Custom hooks */
import { useFirestore } from "./useFirestore"     // hooks để sử dụng dịch vụ firestore của firebase
import { useAuthContext } from "./useAuthContext" // hooks để sủ dụng context chứa xác minh người dùng
import { useDocument } from './useDocument'       // hooks liên kết 1 document trên firestore của firebase



/** -------------------------------------------------------------------------- 
  @CUSTOM_HOOK_FUNCTIONS -----------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hooks (useMyCart) để làm việc với giỏ hàng của user    
 * @Ret1  addProductToCart    - Hàm thêm sản phẩm vào giỏ hàng
 * @Ret2  updateProductToCart - Hàm sửa số lượng sản phẩm trong giỏ hàng
 * @Ret3  removeProductToCart - Hàm xóa 1 sản phẩm khỏi giỏ
 * @Ret4  clearCart           - Hàm xóa toàn bộ giỏ hàng
 * @Ret5  error               - component chuỗi ký tự báo lỗi
 * @Ret6  isPending           - component cờ báo đang làm việc với database
 */
export const useMyCart = () => {
  const [error, setError] = useState(null)          // component chuỗi ký tự báo lỗi
  const [isPending, setIsPending] = useState(false) // component cờ báo đang làm việc với database

  /** object chứa các component liên kết với hooks sử dụng dịch vụ firestore với collection 'products'
   * @Ret1  updateDocument  - hàm sửa một mục document
   */ 
  const { updateDocument, response } = useFirestore('users')

  /** object gồm các component liên kết với hooks để sủ dụng context chứa xác minh người dùng
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()

  /** object chứa các components liên kết với hooks để sử dụng document có id 'id' của 
   *  collection 'products' trên firestore của firebase 
   * @document  component liên kết với document
   * @error     component lỗi khi sử dụng hook
   */
  const { document } = useDocument('users', user.uid)

  /** Hàm thêm sản phẩm vào giỏ hàng khi add to cart 
   * @Arg1  product - object thông tin sản phẩm
   */
  const addProductToCart = async (product) => {
    if(!document) { // không lấy được document user của người dùng
      console.log('Không tồn tại documents "user" của người dùng')  // log lỗi
      setError('Không tồn tại documents "user" của người dùng')     // báo lỗi
      return;
    }

    /** Trích xuất giỏ hàng từ document có uid người dùng trong collection users */ 
    const cart = document?.myCart || [];
    
    setError(null)          // clear components chuỗi ký tự báo lỗi
    setIsPending(true)      // bật cờ báo đang làm việc với database

    let updatedCart = null  // component chứa giỏ hàng sẽ được update lên database

    try {
      /** tìm sản phẩm trong giỏ hàng */
      const existingProduct = cart.find(item => item.id === product.id)
      if (existingProduct) {  // trong giỏ hàng đã có sản phẩm
        /** Tăng số lượng nếu sản phẩm đã có
         * @Ret updatedCart - giỏ hàng mới sau khi tăng
         */
        updatedCart = cart.map(item => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
              updatedAt: timestamp.fromDate(new Date()),
            };
          }
          return item;
        });
      } else {  // trong giỏ hàng chưa có sản phẩm
        /** Thêm sản phẩm mới 
         * @Ret updatedCart - giỏ hàng mới sau khi tăng
         */
        updatedCart = [
          ...cart,
          {
            id: product.id,
            name: product.name,
            image: product.image[0],
            price: product.price,
            quantity: 1,
            updatedAt: timestamp.fromDate(new Date()),
          }
        ];
      }

      /** sửa document với id "user.uid" 
       * @Arg1 id của document
       * @Arg2 thuộc tính cần sửa 
       */
      await updateDocument(user.uid, {  
        myCart: updatedCart,
      })

      setIsPending(false)    // tắt cờ báo đang làm việc với database
      if (response.error) {  // nếu có lỗi, log và báo lỗi
        setError(response.error)
        console.log(response.error) 
      }
    } catch (err) {     // Bắt lỗi nếu có lỗi khi làm việc với database
      setIsPending(false)    // tắt cờ báo đang làm việc với database
      setError(err)
      console.log(err)  // log lỗi
      setError(null)    // clear lỗi
    }
  };

  /** Hàm chỉnh số lượng sản phẩm trong giỏ hàng
   * @Arg1  productId - id của sản phẩm trong giỏ hàng cần update
   * @Arg2  newQuantity - số lượng cụ thể
   * @Arg3  exQuantity - thêm bớt số lượng
   */
  const updateProductToCart = async (productId, newQuantity, exQuantity = 0) => {
    if(!document) { // không lấy được document user của người dùng
      console.log('Không tồn tại documents "user" của người dùng')  // log lỗi
      setError('Không tồn tại documents "user" của người dùng')     // báo lỗi
      return;
    }

    /** Trích xuất giỏ hàng từ document có uid người dùng trong collection users */ 
    const cart = document?.myCart || [];
    
    setError(null)          // clear components chuỗi ký tự báo lỗi
    setIsPending(true)      // bật cờ báo đang làm việc với database
    
    try {
      /** Sửa số lượng sản phẩm trong giỏ hàng 
       * @Ret1  updatedCart - component chứa giỏ hàng sẽ được update lên database
       */
      const updatedCart = cart
        .map(item => {
          if (item.id === productId) {  
            return {
              ...item,
              quantity: newQuantity + exQuantity,
              updatedAt: timestamp.fromDate(new Date()),
            };
          }
          return item;
        })
        .filter(item => item.quantity > 0)  // Xóa sản phẩm nếu số lượng = 0

      /** sửa document với id "user.uid" 
       * @Arg1 id của document
       * @Arg2 thuộc tính cần sửa 
       */
      await updateDocument(user.uid, {  
        myCart: updatedCart,
      })

      setIsPending(false)    // tắt cờ báo đang làm việc với database
      if (response.error) {  // nếu có lỗi, log và báo lỗi
        setError(response.error)
        console.log(response.error) 
      }
    } catch (err) {     // Bắt lỗi nếu có lỗi khi làm việc với database
      setIsPending(false)    // tắt cờ báo đang làm việc với database
      setError(err)
      console.log(err)  // log lỗi
      setError(null)    // clear lỗi
    }
  };

  /** Hàm xóa 1 sản phẩm trong giỏ hàng
   * @Arg1  productId - id của sản phẩm trong giỏ hàng cần update
   */
  const removeProductToCart = async (productId) => {
    if(!document) { // không lấy được document user của người dùng
      console.log('Không tồn tại documents "user" của người dùng')  // log lỗi
      setError('Không tồn tại documents "user" của người dùng')     // báo lỗi
      return;
    }

    /** Trích xuất giỏ hàng từ document có uid người dùng trong collection users */ 
    const cart = document?.myCart || [];
    
    setError(null)          // clear components chuỗi ký tự báo lỗi
    setIsPending(true)      // bật cờ báo đang làm việc với database

    try {
      /** lọc sản phẩm cần xóa trong giỏ hàng 
       * @Ret1  updatedCart - component chứa giỏ hàng sẽ được update lên database
       */
      const updatedCart = cart.filter(item => item.id !== productId);

      /** sửa document với id "user.uid" 
       * @Arg1 id của document
       * @Arg2 thuộc tính cần sửa 
       */
      await updateDocument(user.uid, {  
        myCart: updatedCart,
      })

      setIsPending(false)    // tắt cờ báo đang làm việc với database
      if (response.error) {  // nếu có lỗi, log và báo lỗi
        setError(response.error)
        console.log(response.error) 
      }
    } catch (err) {     // Bắt lỗi nếu có lỗi khi làm việc với database
      setIsPending(false)    // tắt cờ báo đang làm việc với database
      setError(err)
      console.log(err)  // log lỗi
      setError(null)    // clear lỗi
    }
  };

  /** Hàm xóa toàn bộ sản phẩm trong giỏ hàng */
  const clearCart = async () => {
    setError(null)          // clear components chuỗi ký tự báo lỗi
    setIsPending(true)      // bật cờ báo đang làm việc với database

    /** sửa document với id "user.uid" 
     * @Arg1 id của document
     * @Arg2 thuộc tính cần sửa 
     */
    await updateDocument(user.uid, {  
      myCart: [],
    })

    setIsPending(false)    // tắt cờ báo đang làm việc với database
    if (response.error) {  // nếu có lỗi, log và báo lỗi
      setError(response.error)
      console.log(response.error) 
    }
  };

  // ✅ Hook trả về những hàm cần thiết
  return {
    addProductToCart,     // Hàm thêm sản phẩm vào giỏ hàng
    updateProductToCart,  // Hàm sửa số lượng sản phẩm trong giỏ hàng
    removeProductToCart,  // Hàm xóa 1 sản phẩm khỏi giỏ
    clearCart,            // Hàm xóa toàn bộ giỏ hàng
    error,                // component chuỗi ký tự báo lỗi
    isPending,            // component cờ báo đang làm việc với database
  };
};
