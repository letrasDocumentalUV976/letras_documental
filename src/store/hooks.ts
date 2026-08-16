import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { V1Dispatch, V1RootState } from "./types";

export const useV1Dispatch: () => V1Dispatch = useDispatch;
export const useV1Selector: TypedUseSelectorHook<V1RootState> = useSelector;
