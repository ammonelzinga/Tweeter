import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import { UserNavigationPresenter, UserNavigationPresenterView } from "../presenter/UserNavigationPresenter";


interface UserNavigation {
    navigateToUser: (
        event: React.MouseEvent,
    ) => Promise<void>;
    extractAlias: (
        value: string
    ) => string;
    getUser: (
        authToken: AuthToken,
        alias: string
    ) => Promise<User | null>;
}

const useUserNavigationHook= (): UserNavigation =>{

    const { displayErrorMessage } = useToastListener();
    const {setDisplayedUser, currentUser, authToken } =
      useUserInfo();

    
    const listener: UserNavigationPresenterView = {
      setDisplayedUser: setDisplayedUser,
      displayErrorMessage: displayErrorMessage
    }
    const presenter = new UserNavigationPresenter(listener);

    const extractAlias = (value: string): string => {
          return presenter.extractAlias(value);
        };
      
        const getUser = async (
          authToken: AuthToken,
          alias: string
        ): Promise<User | null> => {
          return presenter.getUser(authToken, alias);
        };

    return {
    navigateToUser : async (event: React.MouseEvent): Promise<void> => {
        presenter.navigateToUser(event, authToken!, currentUser!);
      },
    
      extractAlias : extractAlias,
    
       getUser : getUser,

    };
};

export default useUserNavigationHook;

