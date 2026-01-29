import { model } from "mongoose";
import MODEL_NAMES from "../../common/model_manifest";
import { Currency } from "../../common/currencies.enum";
import {
  DefaultSchemaFields,
  RequiredObjectIdType,
  TrimmedRequiredString,
  TrimmedString,
  createSchema,
} from "../../helpers/schema";
import { IWallet } from "./wallet.model";
import { WALLET_TIER, WALLET_TYPE, WALLET_STATUS } from "./wallet.enum";

const schemaFields: Record<keyof Omit<IWallet, DefaultSchemaFields>, object> = {
  balance: { type: Number, default: 0 },
  ledger_balance: { type: Number, default: 0 },
  locked_balance: { type: Number, default: 0 },
  currency: {
    ...TrimmedString,
    enum: Currency,
    default: Currency.NIGERIAN_NAIRA,
  },
  user: { ...RequiredObjectIdType, ref: MODEL_NAMES.USER },
  tier: { ...TrimmedString, enum: WALLET_TIER, default: WALLET_TIER.ONE },
  type: { ...TrimmedRequiredString, enum: WALLET_TYPE },
  status: {
    ...TrimmedString,
    enum: WALLET_STATUS,
    default: WALLET_STATUS.ACTIVE,
  },
  last_transaction_at: { type: Date, min: new Date(Date.now()) },
  closed_at: { type: Date, min: new Date(Date.now()) },
};

const WalletSchema = createSchema(schemaFields);
const Wallet = model<IWallet>(MODEL_NAMES.WALLET, WalletSchema);

export default Wallet;
