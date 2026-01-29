enum LoanApprovalMethod {
  AUTOMATIC = "automatic",
  MANUAL = "manual",
}

enum LoanStatus {
  PENDING = "pending",
  ACTIVE = "active",
  COMPLETED = "completed",
  DEFAULTED = "defaulted",
  CANCELLED = "cancelled",
  WRITTEN_OFF = "written_off",
}

enum LoanRepaymentType {
  SINGLE = "single",
  INSTALLMENTS = "installments",
}

enum LoanInterestType {
  FLAT = "flat",
  REDUCING = "reducing",
}

export { LoanApprovalMethod, LoanStatus, LoanRepaymentType, LoanInterestType };
