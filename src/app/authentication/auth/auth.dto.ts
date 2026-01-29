import { Gender } from '../../user/user.enums';

interface AccessTokenPayload {
  user_id: string;
  name: string;
  gender: Gender;
  login_session_id: string;
}

export { AccessTokenPayload };