import { Document } from "mongoose";
import { Currency } from "../../common/currencies.enum";
import { DbId, EntityModel } from "../../common/interface";
import { WALLET_TIER, WALLET_TYPE, WALLET_STATUS } from "./wallet.enum";
import { IUserDocument, IUser } from "../user/user.model";

export interface IWallet extends EntityModel {
  balance: number;
  ledger_balance: number;
  locked_balance: number;
  currency: Currency;
  user: DbId | IUserDocument | IUser;
  tier: WALLET_TIER;
  type: WALLET_TYPE;
  status: WALLET_STATUS;
  last_transaction_at?: Date;
  closed_at?: Date;
}

export interface IWalletDocument extends IWallet, Document {
  id: string;
}
