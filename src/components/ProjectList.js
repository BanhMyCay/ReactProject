/**
 * @title     Project list
 * @brief     Component project list for page project components
 * @filename  ProjectList.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React route components (Link) */
import { Link } from 'react-router-dom'

/** Custom component */
import Avatar from '../components/Avatar'       // Avatar người dùng

/** Styles */
import './ProjectList.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Project list component 
 * @Arg1  projects  - component array chứa các project cần list
 */
export default function ProjectList({ projects }) {
  console.log(projects)

  return (
    /** thẻ div đại diện project list */
    <div className="project-list">
      {/** thẻ p báo không có project */}
      {projects.length === 0 && <p>No projects yet!</p>}

      {/** map tất cả project trong component 'projects' 
       * @key id của project
       */}
      {projects.map(project => (
        /** Link đường dẫn đến project cụ thể theo id cho mỗi project của list */
        <Link to={`/projects/${project.id}`} key={project.id}>
          {/** thẻ h4 chứa tên của project */}
          <h4>{project.name}</h4>

          {/** thẻ p chứa hạn hoàn thành project */}
          <p>Due by {project.dueDate.toDate().toDateString()}</p>

          {/** thẻ div đại diện các thẻ thông tin người được chỉ định làm project 
           *   @class
          */}
          <div className="assigned-to">
            {/** thẻ p chứa tiêu đề */}
            <p><strong>Assigned to:</strong></p>

            {/** thẻ ul chứa li của mỗi người được chỉ định */}
            <ul>
              {/** map đến từng object của mảng project.assignedUsersList để lấy người chỉ định
               * @user  component tạm thời cho từng object map
               * @key   source avatar của mỗi ng
               */}
              {project.assignedUsersList.map(user => (
                <li key={user.photoURL}>
                  {/** Avatar component */}
                  <Avatar src={user.photoURL} />
                </li>
              ))}
            </ul>
          </div>
        </Link>
      ))}
    </div>
  )
}