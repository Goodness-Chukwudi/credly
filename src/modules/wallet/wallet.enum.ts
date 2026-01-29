enum WALLET_TYPE {
  INDIVIDUAL = "individual",
  MERCHANT = "merchant",
  ADMIN = "admin",
  DISPOSABLE = "disposable"
}

enum WALLET_TIER {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4
}

enum WALLET_STATUS {
  ACTIVE = "active",
  FROZEN = "frozen",
  CLOSED = "closed"
}

export { WALLET_TYPE, WALLET_TIER, WALLET_STATUS };