import { AuthToken } from "tweeter-shared";
import { UserService } from "../modelANDservice/service/UserService";
import { Presenter, View } from "./Presenter";

export interface LogoutView extends View{
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void,
    clearLastInfoMessage:() => void,
    clearUserInfo:() => void,
    displayErrorMessage: (message: string, bootstrapClasses?: string) => void
}


export class LogoutPresenter extends Presenter<LogoutView>{
    private userService: UserService;
    public constructor(view: LogoutView){
        super(view);
        this.userService = new UserService();
    }

    public async logOut (authToken: AuthToken) {
        this.view.displayInfoMessage("Logging Out...", 0);
        
        this.doFailureReportingOperation(async () => {
          await this.userService.logout(authToken!);
          this.view.clearLastInfoMessage();
          this.view.clearUserInfo();}, "log user out");
      };
}