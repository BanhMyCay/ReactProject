/**
 * @title     Project page (ProjectComments)
 * @brief     Component ProjectComments của project page of The Dojo project
 * @filename  ProjectSummary.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components (useState) */
import { useState } from "react"

/** Firebase components (timestamp) */
import { timestamp } from "../../firebase/config"

/** Date-fns components (formatDistanceToNow) */
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

/** Custom hooks */
import { useAuthContext } from "../../hooks/useAuthContext"     // hook để sủ dụng context chứa xác minh người dùng
import { useFirestore } from "../../hooks/useFirestore"         // hook để sử dụng dịch vụ database của firebase

/** Custom component */
import Avatar from "../../components/Avatar"                    // Avatar component


/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** ProjectComments của project page page component 
 * @Arg1  project   component chứa thông tin của project 
 */
export default function ProjectComments({ project }) {
  /** object gồm các component xử lý xác minh người dùng 
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()

  /** object gồm các component liên kết với hooks để sử dụng dịch vụ firestore lên collection 'projects' của firebase
   * @updateDocument    hàm sửa một mục document
   * @response          object respone của hooks
   */
  const { updateDocument, response } = useFirestore('projects')

  const [newComment, setNewComment] = useState('')      // components chứa tạm comment của user

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
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random()
    }

    /**   hàm thực hiện sửa document với id 'project.id' sử dụng dịch vụ database, thêm mới một comments */
    await updateDocument(project.id, {  
      comments: [...project.comments, commentToAdd],
    })
    if (!response.error) {  // nếu không có lỗi, clear component newComment
      setNewComment('')
    }
  }

  return (
    /** thẻ div đại diện ProjectComments component 
     *   @class
     */
    <div className="project-comments">
      {/** thẻ h4 chứa tiêu đề của ProjectComments */}
      <h4>Project Comments</h4>

      {/** thẻ ul chứa các thẻ li đại diện một commment */}
      <ul>
        {/** đảm bảo có bình luận, map từng object chưa thông tin comment trong mảng project.comments 
         * @key   id của commment
         */}
        {project.comments.length > 0 && project.comments.map(comment => (
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
              <p>{formatDistanceToNow(comment.createdAt.toDate(), {addSuffix: true})}</p>
            </div>

            {/** thẻ dive đại diện nội dung commment */}
            <div className="comment-content">
              {/** thẻ p chứa nội dung commment */}
              <p>{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>

      {/** thẻ form chứa các input của ProjectComments */}
      <form className="add-comment" onSubmit={handleSubmit}>
        {/** thẻ label đại diện input comment của ProjectComments */}
        <label>
          {/** thẻ span chứa tiêu đề của input comment ProjectComments */}
          <span>Add new comment:</span>
          {/** thẻ textarea chứa nội dung của input comment ProjectComments 
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