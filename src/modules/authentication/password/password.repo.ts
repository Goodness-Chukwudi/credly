import Repository from "../../../base/repo";
import { IPassword, IPasswordDocument } from "./password.model";
import Password from "./password.schema";

class PasswordRepo extends Repository<IPassword, IPasswordDocument> {
  constructor() {
    super(Password);
  }
}

const passwordRepo = new PasswordRepo();
export default passwordRepo;
