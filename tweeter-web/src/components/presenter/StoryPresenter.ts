import { AuthToken } from "tweeter-shared";
import { StatusService } from "../modelANDservice/service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class StoryPresenter extends StatusItemPresenter{
    private statusService: StatusService;
    
    public constructor(view: StatusItemView){
        super(view);
        this.statusService = new StatusService;
    }

      public async loadMoreItems (authToken: AuthToken, userAlias: string){
        try {
          const [newItems, hasMore] = await this.statusService.loadMoreStoryItems(
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
          );
    
          this.hasMoreItems = (hasMore);
          this.lastItem = (newItems[newItems.length - 1]);
          this.view.addItems(newItems);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to load stories because of exception: ${error}`
          );
        }
      };
}