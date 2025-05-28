/**
 * @title     Express App setup file
 * @brief     File setup Express App
 * @filename  server.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      28/05/2025
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Express package */
const express = require('express')





/** -------------------------------------------------------------------------- 
  @COMPONENT -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Express app component */
const exapp = express()

/** Lắng nghe requests trên cổng '4000'  */
exapp.listen(process.env.PORT, () => {
  console.log('listening on port', process.env.PORT)
})


 