import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../modelANDservice/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationPresenterView extends View{
    setDisplayedUser: (user: User) => void,
}


export class UserNavigationPresenter extends Presenter<UserNavigationPresenterView>{
    private userService: UserService;
    public constructor(view: UserNavigationPresenterView){
        super(view);
        this.userService = new UserService;
    }
    public extractAlias (value: string): string{
        const index = value.indexOf("@");
        return value.substring(index);
      };

    public async getUser (
                authToken: AuthToken,
                alias: string
              ): Promise<User | null> {
                return this.userService.getUser(authToken, alias);
              };

    public async navigateToUser(event: React.MouseEvent, authToken: AuthToken, currentUser: User): Promise<void> {
        event.preventDefault();
        this.doFailureReportingOperation(async () => {
          const alias = this.extractAlias(event.target.toString());
          const user = await this.userService.getUser(authToken!, alias);
          if (!!user) {
            if (currentUser!.equals(user)) {
              this.view.setDisplayedUser(currentUser!);
            } else {
              this.view.setDisplayedUser(user);
            }
          }
        }, "get user");    
      }
}