import { UserContext } from "../store/contextProvider";
import { useContext } from "react";

export const useUserContext = ()=>{
    const context = useContext(UserContext);

    if(!context) throw new Error("No user context provided");

    return context;
}