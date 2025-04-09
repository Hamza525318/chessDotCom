import {useContext,createContext,ReactNode,useState} from 'react';


interface User{
    id: string | null;
    email: string | null;
    displayName: string | null;
}



interface UserContextType{
   user: User,
   setUser: React.Dispatch<React.SetStateAction<User>>
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User>({id: null, email: null, displayName: null});

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}
