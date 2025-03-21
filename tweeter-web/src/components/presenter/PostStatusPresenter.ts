//Assuming that the presenter does not handle checking to see if the post status and clear buttons should be disabled or not
//should isLoading be put in the presenter?

import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../modelANDservice/service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View{
    displayErrorMessage: (message: string) => void,
    displayInfoMessage: (message: string, duration: number) => void,
    clearLastInfoMessage: () => void
}

export class PostStatusPresenter extends Presenter<PostStatusView>{
    private statusService: StatusService;

    public constructor(view: PostStatusView){
        super(view);
        this.statusService = new StatusService();
    }
    public get view(): PostStatusView{
        return super.view as PostStatusView;
    }

    public async submitPost (post: string, currentUser: User, authToken: AuthToken) {
        this.doFailureReportingOperation(async () => {
          this.view.displayInfoMessage("Posting status...", 0);
          const status = new Status(post, currentUser!, Date.now());
          await this.statusService.postStatus(authToken!, status);
          this.view.displayInfoMessage("Status posted!", 2000);}, "post the status");
         
        this.view.clearLastInfoMessage();
      };

}