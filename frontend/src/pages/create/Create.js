/**
 * @title     Ceate page
 * @brief     Component Ceate page of My Store project
 * @filename  Create.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      03/06/2025
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components */
import { 
  useState  // hooks lưu trữ và cập nhật state
} from 'react'

/** React route components */
import { 
  useNavigate  
} from 'react-router'

/** React select components (Select) */
import Select from 'react-select'
       

/** Custom hooks */
import { useAuthContext } from '../../hooks/useAuthContext' // hooks để sủ dụng context chứa xác minh người dùng
import { useFirestore } from '../../hooks/useFirestore'       // hooks để sử dụng dịch vụ database

/** Styles */
import './Create.css'



/** -------------------------------------------------------------------------- 
  @GLOBAL_COMPONENT ----------------------------------------------------------
--------------------------------------------------------------------------- */
/** components array chứa các object để lựa chọn phân loại product 
 *  sử dụng component select của react
 *  @value                @label hiển thị
 */
const categories = [
  { value: 'beauty',    label: 'Beauty' },
  { value: 'fragrances',label: 'Fragrances' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'groceries', label: 'Groceries' },
]



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Create page component */
export default function Ceate() {
  /** component gắn với hooks để sử dụng dịch vụ lịch sử duyêt web */
  const navigate = useNavigate()
  
  /** object bồm các component làm việc với hooks sử dung dịch vụ database của Firebase
   * @'products'  tên collection cần làm việc
   * @addDocument hàm thêm một mục document
   * @response    object respone của hooks
  */
  const { addDocument, response } = useFirestore('products')
  
  /** object gồm các component xử lý xác minh người dùng 
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()

  const [name, setName] = useState('')                  // component tạm lưu tên product
  const [details, setDetails] = useState('')            // component tạm lưu thông tin product
  const [category, setCategory] = useState('')          // component tạm lưu phân loại cho product
  const [price, setPrice] = useState('')                // component tạm lưu thời hạn product
  
  const [newImage, setNewImgage] = useState('')         // components chứa link ảnh tạm thời
  const [images, setImages] = useState([])              // components array chứa tất cả link ảnh sản phẩm
  
  const [formError, setFormError] = useState(null)      

  /** Hàm kiểm tra link ảnh có hợp lệ không 
   * @Arg1   "url" - link ảnh
   * @Ret1   true/false
   */ 
  const isValidImageURL = (url) => {
    const pattern = /^https?:\/\/.*\.(jpeg|jpg|png|gif|webp|svg)$/i;
    return pattern.test(url.trim());
  };

  /** hàm xử lý khi add thêm link URL ảnh product
   * @e    sự kiện submit
   */
  const handleAdd = (e) => {
    e.preventDefault()  // ngăn xử lý mặc định (reload pages)
    setNewImgage('')    // xóa components chứa link ảnh tạm thời

    if (!newImage) {    // nếu không có ảnh, log lỗi
      setFormError('Please fill URL of image');
      return;
    }

    if (!isValidImageURL(newImage)) {
      setFormError('Link không hợp lệ. Phải kết thúc bằng .jpg, .png, .gif,...');
      return;
    }

    const ing = newImage.trim()     // components chứa link ảnh đã loại bỏ ký tự vô nghĩa (" ")

    if (ing && !images.includes(ing)) { // đảm bảo có link ảnh mới và không trùng
      /** thêm link ảnh vào components array chứa tất cả link ảnh */
      setImages(prevImages => [...prevImages, ing])
    }
  }

  /** hàm xử lý sự kiện submit khi ấn nút tạo product
   * @e     sự kiện submit
   * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault()      // ngăn xử lý mặc định của sự kiện (reload pages)
    setFormError(null)      // clear lỗi


    if (!category) {        // không phân loại Product, báo lỗi
      setFormError('Please select a product category.')
      return
    }

    /** component chứa object thông tin  người tạo product 
     * @displayName tên người tạo
     * @photoURL    avatar ng tạo
     * @id          
     */
    const createdBy = { 
      displayName: user.displayName, 
      photoURL: user.photoURL,
      id: user.uid
    }

    /** component chứa object tất cả thông tin 1 product 
     * @name      tên product
     * @details   thông tin product
     * @category  phân loại product
     * @price     giá product
     * @imageURL  array chứa các link URL ảnh sản phẩm
     * @createdBy object thông tin người tạo product 
     * @comments  array chứa các comment về product
     */
    const product = {
      name,
      details,
      category: category.value,
      price,
      image: images,
      createdBy,
      comments: []
    }

    /** hàm thực hiện thêm document sử dụng dịch vụ firestore của firebase*/
    await addDocument(product)
    if (!response.error) {  // nếu không có lỗi, chuyển hướng URL về pages mặc định
      navigate('/')
    }
  }

  return (
    /** thẻ div đại diện create page 
     *   @class
     */
    <div className="create-form">

      {/** thẻ h2 chứa tiêu đề của page
        *  @class 
        */}
      <h2 className="page-title">Create a new Product</h2>

      {/** thẻ form chứa form tạo product
        *   @handleCLick 
        */}
      <form onSubmit={handleSubmit}>
        {/** thẻ label đại diện ô input tên product */}
        <label>
          {/** thẻ span tiêu đề ô input tên product */}
          <span>Product name:</span>
          {/** thẻ input điền tên product 
            * @type     loại input text
            * @onChange khi input thay đổi sẽ đặt giá trị components password theo giá trị input
            * @value    giá trị của input thay đổi theo components password
            * @required bắt buộc có giá trị
            */}
          <input
            type="text" 
            onChange={(e) => setName(e.target.value)}
            value={name}
            required 
          />
        </label>

        {/** thẻ label đại diện ô input thông tin product */}
        <label>
          {/** thẻ span tiêu đề ô input thông tin product */}
          <span>Product details:</span>
          {/** thẻ textarea điền thông tin product 
            * @onChange khi input thay đổi sẽ đặt giá trị components password theo giá trị input
            * @value    giá trị của input thay đổi theo components password
            * @required bắt buộc có giá trị
            */}
          <textarea 
            onChange={(e) => setDetails(e.target.value)}
            value={details} 
            required
          ></textarea>
        </label>

        {/** thẻ label đại diện ô input thông tin Product */}
        <label>
          {/** thẻ span tiêu đề ô input thông tin Product */}
          <span>Product price:</span>
          {/** thẻ input điền giá Product 
            * @onChange khi input thay đổi sẽ đặt giá trị components password theo giá trị input
            * @value    giá trị của input thay đổi theo components password
            * @required bắt buộc có giá trị
            */}
          <input
            type="number" 
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            required 
          />
        </label>

        {/** thẻ label đại diện ô input phân loại Product */}
        <label>
          {/** thẻ span tiêu đề ô input phân loại Product */}
          <span>Product category:</span>
          {/** component select để chọn phân loại Product
            * @onChange khi input thay đổi sẽ đặt giá trị components password theo giá trị input
            * @options  các lựa chọn được gắn với component categories
            */}
          <Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>

        {/** thẻ đại diên ô input thêm link ảnh */}
        <label>
          {/** thẻ chứa nhãn ô input thêm link ảnh */}
          <span>Product imageURL: {images.map(i => <em key={i}>["{i}"], </em>)}</span>
          {/** thẻ input tiêu đề 
           * @type      loại input - gõ text
           * @onChange  input thay đổi sẽ cập nhật components newIngredient theo phím bấm
           * @value     giá trị input cập nhật theo components newIngredient
           * @ref       gắn thẻ input vào component ref ingredientInput
          */}
          <input 
            type="text" 
            onChange={(e) => setNewImgage(e.target.value)}
            value={newImage}
          />
          {/** thẻ nút nhấn thêm nguyên liệu 
            *     @click_handle       @class
            */}
          <button onClick={handleAdd} className="btn">add</button>
        </label>

        {/** thẻ button nút tạo Product mới
         *      @class
         */}
        <button className="btn">Add Product</button>

        {/** thẻ p hiển thị lỗi nếu có lỗi
         *               @class
         */}
        {formError && <p className="error">{formError}</p>}
      </form>

    </div>
  )
}

