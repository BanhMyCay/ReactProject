/**
 * @title     Product page (ProductComments)
 * @brief     Component ProductComments của Product page of My Store project
 * @filename  ProductSummary.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components (useState) */
import { 
  useState,
  useEffect,
} from "react"

/** Firebase components (timestamp) */
//import { timestamp } from "../../firebase/config"

/** Date-fns components (formatDistanceToNow) */
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

/** Custom hooks */
import { useAuthContext } from "../../hooks/useAuthContext"   // hook để sủ dụng context chứa xác minh người dùng
import { useMongoDB } from "../../hooks/useMongoDB"           // hooks để sử dụng dịch vụ database của mongoDB
//import { useFirestore } from "../../hooks/useFirestore"       // hook để sử dụng dịch vụ database của firebase

/** Custom component */
import Avatar from "../../components/Avatar"                  // Avatar component


/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** ProductComments của Product page component 
 * @Arg1  product - component chứa thông tin của project 
 */
export default function ProductComments({ product }) {  
  /** object gồm các component xử lý xác minh người dùng 
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()

  /** object gồm các component liên kết với hooks để sử dụng dịch vụ firestore lên collection 'products' của firebase
   * @updateDocument    hàm sửa một mục document
   * @response          object respone của hooks
   */
  const { updateDocument, response } = useMongoDB('products')

  const [newComment, setNewComment] = useState('')      // components chứa tạm comment của user
  const [localComments, setLocalComments] = useState([]); // components chứa tạm tất cả comment của user

  /** update lần đầu render và chỉ update khi product thay đổi  */
  useEffect(() => {
    if (product?.comments?.length >= 0) {
      setLocalComments(product.comments);
    }
  }, [product]);

  /**   hàm xử lý sự kiện submit khi ấn nút để comment
   * @e     sự kiện submit
   * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();      // ngăn xử lý mặc định của sự kiện (reload pages)

    /** component object chứa các thông tin một commments để lưu lên firestore 
     * @displayName tên người comment
     * @photoURL    nguồn avatar người comment
     * @content     nội dung comment
     * @createdAt   ngày comment
     * @id          id của comment
     */
    const commentToAdd = {  
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: newComment,
      createdAt: new Date(),
      id: Math.random()
    }

    /**   hàm thực hiện sửa document với id 'product.id' sử dụng dịch vụ database, thêm mới một comments */
    await updateDocument(product.id, {  
      comments: [...localComments, commentToAdd],
    })
    if (!response.error) {  // nếu không có lỗi, clear component newComment
      setNewComment('')
      setLocalComments(prev => [...prev, commentToAdd])
    }
  }

  return (
    /** thẻ div đại diện ProductComments component 
     *   @class
     */
    <div className="product-comments">
      {/** thẻ h4 chứa tiêu đề của ProductComments */}
      <h4>Product Comments</h4>

      {/** thẻ ul chứa các thẻ li đại diện một commment */}
      <ul>
        {/** đảm bảo có bình luận, map từng object chưa thông tin comment trong mảng product.comments 
         * @key   id của commment
         */}
        {localComments.length > 0 && localComments.map(comment => (
          /** thẻ li đại diện một commment */
          <li key={comment.id}>
            {/** thẻ div đại diện người commment */}
            <div className="comment-author">
              {/** avatar người commment */}
              <Avatar src={comment.photoURL} />
               {/** thẻ p chứa tên người commment */}
              <p>{comment.displayName}</p>
            </div>

            {/** thẻ dive đại diện thời gian commment */}
            <div className="comment-date">
              {/** thẻ p chứa thời gian commment, sử dụng component formatDistanceToNow
               *                      //chuyển timestamp to string //thêm tiền tố ago  
               */}
              <p>{formatDistanceToNow(new Date(comment.createdAt), {addSuffix: true})}</p>
            </div>

            {/** thẻ dive đại diện nội dung commment */}
            <div className="comment-content">
              {/** thẻ p chứa nội dung commment */}
              <p>{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>

      {/** thẻ form chứa các input của ProductComments */}
      <form className="add-comment" onSubmit={handleSubmit}>
        {/** thẻ label đại diện input comment của ProductComments */}
        <label>
          {/** thẻ span chứa tiêu đề của input comment ProductComments */}
          <span>Add new comment:</span>
          {/** thẻ textarea chứa nội dung của input comment ProductComments 
            * @onChange khi input thay đổi sẽ đặt giá trị components newComment theo giá trị input
            * @value    giá trị của input thay đổi theo components newComment
            * @required bắt buộc có giá trị
            */}
          <textarea
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
            required
          ></textarea>
        </label>

        {/** thẻ button chứa nút nhấn để comment */}
        <button className="btn">Add Comment</button>
      </form>
    </div>
  )
}