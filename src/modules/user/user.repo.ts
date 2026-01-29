import Repository from '../../base/repo';
import { IUser, IUserDocument } from './user.model';
import User from './user.schema';

class UserRepo extends Repository<IUser, IUserDocument> {
  constructor() {
    super(User);
  }
}

const userRepo = new UserRepo();
export default userRepo;
