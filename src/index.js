/**
 * @title     Index
 * @brief     Index, origin startup of MyMoney project
 * @filename  Index.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React */
import React from 'react';
import ReactDOM from 'react-dom/client';

/** Components */
import App from './App';                                        // App (main) components of MyMoney project

/** Provider context */
import { AuthContextProvider } from './context/AuthContext';    // Provider context chứa xác minh người dùng

/** Styles */
import './index.css';



/** -------------------------------------------------------------------------- 
  @STARTUP_FUNCTIONS ---------------------------------------------------------
--------------------------------------------------------------------------- */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
);


