import { combineReducers } from 'redux';

import { base } from './Base';
import { authentication } from './Authentication';
import { registration } from './Registration';
import { userProfile } from './UserProfile';
import { recommendation } from './Recommendation';

const rootReducer = combineReducers({
  base,
  authentication,
  registration,
  userProfile,
  recommendation,
});

export default rootReducer;
