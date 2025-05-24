/**
 * @title     useDocument hook
 * @brief     Custom hooks (useDocument) liên kết 1 document trên firestore của firebase
 * @filename  useFirestore.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
import { useEffect, useState } from "react"
import { projectFirestore } from "../firebase/config"



/** -------------------------------------------------------------------------- 
  @CUSTOM_HOOK_FUNCTIONS -----------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hook (useDocument) liên kết 1 document trên firestore của firebase
 * @Arg1  collection- tên collection cần sử dụng
 * @Ret2  id        - id của document
 * @Ret1  document  - component liên kết với document
 * @Ret2  error     - component lỗi khi sử dụng hook
*/
export const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null)    // component liên kết với document
  const [error, setError] = useState(null)          // component lỗi khi sử dụng hook

  /** Sử dụng useEffect để chạy một lần các hàm bên trong 
   * @dependency1   collection  - tên collection cần sử dụng
   * @dependency2   id          - id của document
   */
  useEffect(() => {
    /** component liên kết với document có id 'id' trong collection 'collection' */
    const ref = projectFirestore.collection(collection).doc(id)

    /** hàm theo dõi liên tục (onSnapshot) document, nếu có thay đổi trả về 'snapshot' 
     * @unsubscribe     component để clear function khi component cha mất liên kết
     */
    const unsubscribe = ref.onSnapshot(snapshot => {
      /** nếu có dữ liệu, update component 'document' và clear lỗi */
      if(snapshot.data()) {
        setDocument({...snapshot.data(), id: snapshot.id})
        setError(null)
      }
      else {        // không có dữ liệu, báo lỗi
        setError('No such document exists')
      }
    }, err => {     // nếu onSnapshot lỗi, báo lỗi
      console.log(err.message)
      setError('failed to get document')
    })

    // gọi hàm clear function khi component cha mất liên kết 
    return () => unsubscribe()

  }, [collection, id])

  return { document, error }
}