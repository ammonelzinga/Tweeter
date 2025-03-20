import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../modelANDservice/service/UserService";

export interface UserNavigationPresenterView{
    setDisplayedUser: (user: User) => void,
    displayErrorMessage: (message: string, bootstrapClasses?: string) => void
}


export class UserNavigationPresenter {

    private view: UserNavigationPresenterView;
    private userService: UserService;
    public constructor(view: UserNavigationPresenterView){
        this.view = view;
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
    
        try {
          const alias = this.extractAlias(event.target.toString());
    
          const user = await this.userService.getUser(authToken!, alias);
    
          if (!!user) {
            if (currentUser!.equals(user)) {
              this.view.setDisplayedUser(currentUser!);
            } else {
              this.view.setDisplayedUser(user);
            }
          }
        } catch (error) {
          this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
      }
}