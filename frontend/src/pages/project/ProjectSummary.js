/**
 * @title     Project page (ProjectSummary)
 * @brief     Component projectSummary của project page of The Dojo project
 * @filename  ProjectSummary.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React route component (useNavigate) */
import { useNavigate } from 'react-router-dom'

/** Custom hooks */
import { useFirestore } from "../../hooks/useFirestore"           // hooks để sử dụng dịch vụ firestore của firebase
import { useAuthContext } from "../../hooks/useAuthContext" // hooks để sủ dụng context chứa xác minh người dùng

/** Custom components */
import Avatar from "../../components/Avatar"                // Avatar components



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** ProjectSummary của project page page component 
 * @Arg1  project   component chứa thông tin của project  
 */
export default function ProjectSummary({ project }) {
  /** object chứa các component liên kết với hooks sử dụng dịch vụ firestore với collection 'projects' 
   * @deleteDocument  hàm xóa một mục document
   */ 
  const { deleteDocument } = useFirestore('projects')

  /** object gồm các component liên kết với hooks để sủ dụng context chứa xác minh người dùng
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()

  /** component liên kết với hook (useNavigate) để chuyển hướng URL */
  const navigate = useNavigate()

  /** hàm xử lý khi ấn nút xóa project */
  const handleClick = () => {
    /** hàm xóa một mục document với id 'project.id' */
    deleteDocument(project.id)

    /** chuyển hướng URL về page mặc định */
    navigate('/')
  }

  return (
    /** thẻ div đại diện ProjectSummary */
    <div>
      {/** thẻ div đại diện ProjectSummary 
       *   @class
       */}
      <div className="project-summary">
        {/** thẻ h2 chứa tiêu đề của project 
         *  @class
         */}
        <h2 className="page-title">{project.name}</h2>
        
        {/** thẻ p chứa thời hạn của project 
         * @class
         */}
        <p className="due-date">
          Project due by {project.dueDate.toDate().toDateString()}
        </p>

        {/** thẻ p chứa thông tin của project 
         * @class
         */}
        <p className="details">
          {project.details}
        </p>

        {/** thẻ h4 chứa tiêu đề người được chỉ định làm project project 
         * @class
         */}
        <h4>Project assigned to:</h4>

        {/** thẻ div đại diện các thẻ hiển thị người được chỉ định làm project project 
         *   @class
         */}
        <div className="assigned-users">
          {/** map đến từng object chứa thông tin người được chỉ định trong mảng project.assignedUsersList
            * @key  id của người được chỉ định 
            */}
          {project.assignedUsersList.map(user => (
            /** thẻ div chứa component avatar của người được chỉ định */
            <div key={user.id}>
              <Avatar src={user.photoURL} />
            </div>
          ))}
        </div>
      </div>

      {/** thẻ button để xóa project, chỉ người tạo project mới có thể xóa
       *        @class          @handleClick
       */}
      {user.uid === project.createdBy.id && (
        <button className="btn" onClick={handleClick}>Mark as Complete</button>
      )}

    </div>
  )
}