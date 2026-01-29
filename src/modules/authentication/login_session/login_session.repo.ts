import Repository from '../../../base/repo';
import { ILoginSession, ILoginSessionDocument } from './login_session.model';
import LoginSession from './login_session.schema';

class LoginSessionRepo extends Repository<ILoginSession, ILoginSessionDocument> {
  constructor() {
    super(LoginSession);
  }
}

const loginSessionRepo = new LoginSessionRepo();
export default loginSessionRepo;
