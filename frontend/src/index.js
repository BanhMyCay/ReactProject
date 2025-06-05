/**
 * @title     Index
 * @brief     Index, origin startup of My Store project
 * @filename  Index.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      02/06/2025
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React */
import React from 'react';
import ReactDOM from 'react-dom/client';

/** Components */
import App from './App';                                        // App (main) components of My Store project

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


