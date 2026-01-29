enum BIT {
  ON = 1,
  OFF = 0,
}

enum SessionDeactivationReason {
  USER_LOG_OUT = 'User_Log_Out',
  USER_PASSWORD_RESET = 'User_Password_Reset',
  USER_LOGIN = 'User_Login',
  SYSTEM_LOG_OUT = 'System_Log_Out',
  ADMIN_LOG_OUT = 'Admin_Log_Out',
  TOKEN_EXPIRY = 'Token_Expiry',
  SESSION_EXPIRY = 'Session_Expiry',
  TOKEN_REFRESH = 'Token_Refresh',
}

export { BIT, SessionDeactivationReason };
