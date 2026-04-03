// ACTION TYPES

import { UserData } from "@/types";
import { legacy_createStore } from "redux";

const AUTHENTICATE = "AUTHENTICATE";

const UNAUTHENTICATE = "UNAUTHENTICATE";

interface AuthenticateAction {
  type: typeof AUTHENTICATE;
  payload: UserData;
}

interface UnauthenticateAction {
  type: typeof UNAUTHENTICATE;
}

type Action = AuthenticateAction | UnauthenticateAction;

// REDUCER

interface State {
  user?: UserData;
}

const initialState: State = {
  user: undefined,
};

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return { ...state, user: action.payload };

    case UNAUTHENTICATE:
      return { ...state, user: undefined };

    default:
      return state;
  }
};

const store = legacy_createStore(reducer);
export default store;
