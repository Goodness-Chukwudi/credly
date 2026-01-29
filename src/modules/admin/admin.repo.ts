import Repository from "../../base/repo";
import { IAdmin, IAdminDocument } from "./admin.model";
import Admin from "./admin.schema";


class AdminRepo extends Repository<IAdmin, IAdminDocument> {
  constructor() {
    super(Admin);
  }
}

const adminRepo = new AdminRepo();
export default adminRepo;
