import Repository from "../../base/repo";
import { IWallet, IWalletDocument } from "./wallet.model";
import Wallet from "./wallet.schema";

class WalletRepo extends Repository<IWallet, IWalletDocument> {
  constructor() {
    super(Wallet);
  }
}

const walletRepo = new WalletRepo();
export default walletRepo;
