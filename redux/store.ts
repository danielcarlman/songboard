// ACTION TYPES

import { devToolsEnhancer } from "@redux-devtools/extension";
import { UserData } from "@/types";
import { legacy_createStore } from "redux";
import { useDispatch } from "react-redux";

export const AUTHENTICATE = "AUTHENTICATE";

export const UNAUTHENTICATE = "UNAUTHENTICATE";

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
  console.log("ACTION :", action);
  console.log("STATE :", state);
  switch (action.type) {
    case AUTHENTICATE:
      return { ...state, user: action.payload };

    case UNAUTHENTICATE:
      return { ...state, user: undefined };

    default:
      return state;
  }
};

const enhancer = devToolsEnhancer();
const store = legacy_createStore(reducer, enhancer);
export default store;
type AppDispatch = typeof store.dispatch;
export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
