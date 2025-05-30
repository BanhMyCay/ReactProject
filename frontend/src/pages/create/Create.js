/**
 * @title     Ceate page
 * @brief     Component Ceate page of The Dojo project
 * @filename  Home.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components (useState, useEffect) */
import { useState, useEffect  } from 'react'

/** React route components (useNavigate) */
import { useNavigate } from 'react-router'

/** React select components (Select) */
import Select from 'react-select'

/** Firebase component (timestamp) */
import { timestamp } from '../../firebase/config'           

/** Custom hooks */
import { useCollection } from '../../hooks/useCollection'   // hooks liên kết collection trên database của firebase
import { useAuthContext } from '../../hooks/useAuthContext' // hooks để sủ dụng context chứa xác minh người dùng
import { useMongo } from '../../hooks/useMongo'             // hooks để sử dụng dịch vụ database

/** Custom components */

/** Styles */
import './Create.css'



/** -------------------------------------------------------------------------- 
  @GLOBAL_COMPONENT ----------------------------------------------------------
--------------------------------------------------------------------------- */
/** components array chứa các object để lựa chọn phân loại project 
 *  sử dụng component select của react
 *  @value                @label hiển thị
 */
const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design',      label: 'Design' },
  { value: 'sales',       label: 'Sales' },
  { value: 'marketing',   label: 'Marketing' },
]



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Create page component */
export default function Ceate() {
  /** component gắn với hooks để sử dụng dịch vụ lịch sử duyêt web */
  const navigate = useNavigate()
  
  /** object bồm các component làm việc với hooks sử dung dịch vụ database của Firebase
   * @'projects'  tên collection cần làm việc
   * @addDocument hàm thêm một mục document
   * @response    object respone của hooks
  */
  const { addDocument, response } = useMongo('projects')
  
  /** object gồm các component liên kết collection trên database của firebase
   * @documents component chứa các documents của collection
   */
  const { documents } = useCollection('users')

  /** object gồm các component xử lý xác minh người dùng 
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()

  const [users, setUsers] = useState([])                // component mảng chứa tất cả người dùng

  const [name, setName] = useState('')                  // component tạm lưu tên project
  const [details, setDetails] = useState('')            // component tạm lưu thông tin project
  const [dueDate, setDueDate] = useState('')            // component tạm lưu thời hạn project
  const [category, setCategory] = useState('')          // component tạm lưu phân loại cho project
  const [assignedUsers, setAssignedUsers] = useState([])// component tạm lưu người được chỉ định làm project
  const [formError, setFormError] = useState(null)      
  
  /** useEffect chạy quét tất cả user và lưu tạm vào components 
   * @dependency1 documents - component chứa các documents của collection
   */
  useEffect(() => {
    if(documents) {   // đảm bảo component có document/
      /** map từng components trong documents */
      setUsers(documents.map(user => { 
        return { value: {...user, id: user.id}, label: user.displayName }
      }))
    }
  }, [documents])

  /**   hàm xử lý sự kiện submit khi ấn nút tạo project
   * @e     sự kiện submit
   * @note  @async và @await để sử dụng các hàm bất đồng bộ khi làm việc với backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault()      // ngăn xử lý mặc định của sự kiện (reload pages)
    setFormError(null)      // clear lỗi


    if (!category) {        // không phân loại project, báo lỗi
      setFormError('Please select a project category.')
      return
    }
    if (assignedUsers.length < 1) {   // không ủy quyền người làm, báo lỗi
      setFormError('Please assign the project to at least 1 user')
      return
    }

    /** component array chứa các object về thông tin ng được chỉ định làm project 
     *  sử dụng map đến từng object trong component array assignedUsers dể lấy value của ng được chỉ định
     * @displayName tên người được chỉ định
     * @photoURL    nguồn lấy ảnh avatar trên storage của firebase
     * @id          id của người được chỉ định
     */
    const assignedUsersList = assignedUsers.map(u => {
      return { 
        displayName: u.value.displayName, 
        photoURL: u.value.photoURL,
        id: u.value.id
      }
    })

    /** component chứa object thông tin  người tạo project 
     * @displayName tên người tạo
     * @photoURL    avatar ng tạo
     * @id          
     */
    const createdBy = { 
      displayName: user.displayName, 
      photoURL: user.photoURL,
      id: user.uid
    }

    /** component chứa object tất cả thông tin 1 project 
     * @name      tên 1 project
     * @details   thông tin project
     * @category  phân loại project
     * @dueDate   thời hạn của project
     * @assignedUsersList component array chứa các object về thông tin ng được chỉ định làm project 
     * @createdBy component chứa object thông tin người tạo project 
     * @comments  component array chứa các comment về project
     */
    const project = {
      name,
      details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      assignedUsersList, 
      createdBy,
      comments: []
    }

    /** hàm thực hiện thêm document sử dụng dịch vụ firestore của firebase*/
    await addDocument(project)
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
      <h2 className="page-title">Create a new Project</h2>

      {/** thẻ form chứa form tạo project
        *   @handleCLick 
        */}
      <form onSubmit={handleSubmit}>
        {/** thẻ label đại diện ô input tên project */}
        <label>
          {/** thẻ span tiêu đề ô input tên project */}
          <span>Project name:</span>
          {/** thẻ input điền tên project 
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

        {/** thẻ label đại diện ô input thông tin project */}
        <label>
          {/** thẻ span tiêu đề ô input thông tin project */}
          <span>Project Details:</span>
          {/** thẻ textarea điền thông tin project 
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

        {/** thẻ label đại diện ô input thời hạn project */}
        <label>
          {/** thẻ span tiêu đề ô input thời hạn project */}
          <span>Set due date:</span>
          {/** thẻ input điền thời hạn project 
            * @type     date điền thời gian
            * @onChange khi input thay đổi sẽ đặt giá trị components password theo giá trị input
            * @value    giá trị của input thay đổi theo components password
            * @required bắt buộc có giá trị
            */}
          <input
            type="date" 
            onChange={(e) => setDueDate(e.target.value)} 
            value={dueDate}
            required 
          />
        </label>

        {/** thẻ label đại diện ô input phân loại project */}
        <label>
          {/** thẻ span tiêu đề ô input phân loại project */}
          <span>Project category:</span>
          {/** component select để chọn phân loại project
            * @onChange khi input thay đổi sẽ đặt giá trị components password theo giá trị input
            * @options  các lựa chọn được gắn với component categories
            */}
          <Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>

        {/** thẻ label đại diện ô input người xử lý project */}
        <label>
          {/** thẻ span tiêu đề ô input người xử lý project */}
          <span>Assign to:</span>
          {/** component select để chọn người xử lý project
            * @onChange khi input thay đổi sẽ đặt giá trị components password theo giá trị input
            * @options  các lựa chọn được gắn với component categories
            * @isMulti  nhiều lựa chọn
            */}
          <Select
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            isMulti
          />
        </label>

        {/** thẻ button nút tạo project mới
         *      @class
         */}
        <button className="btn">Add Project</button>

        {/** thẻ p hiển thị lỗi nếu có lỗi
         *               @class
         */}
        {formError && <p className="error">{formError}</p>}
      </form>

    </div>
  )
}

