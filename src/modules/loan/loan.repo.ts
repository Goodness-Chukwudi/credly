import Repository from "../../base/repo";
import { ILoan, ILoanDocument } from "./loan.model";
import Loan from "./loan.schema";


class LoanRepo extends Repository<ILoan, ILoanDocument> {
  constructor() {
    super(Loan);
  }
}

const loanRepo = new LoanRepo();
export default loanRepo;
