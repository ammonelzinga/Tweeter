import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../modelANDservice/service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View{
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void, 
    navigate: (to: string) => void, 
    displayErrorMessage: (message: string) => void
}

export class LoginPresenter extends Presenter<LoginView>{
    private userService: UserService;

    public constructor(view: LoginView){
        super(view);
        this.userService = new UserService;
    }

    public get view(){
        return super.view as LoginView;
    }

    public set view(value: LoginView){
        this.view = value;
    }

    public async doLogin (alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
        this.doFailureReportingOperation(async () => {
          const [user, authToken] = await this.userService.login(alias, password);
          this.view.updateUserInfo(user, user, authToken, rememberMe);
          if (!!originalUrl) {
            this.view.navigate(originalUrl);
          } else {
            this.view.navigate("/");
          }}, "log user in")  
      };
}