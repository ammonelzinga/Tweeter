import { AuthToken, Status, User } from "tweeter-shared";
import {StatusItemPresenter} from "./StatusItemPresenter";
import { PAGE_SIZE, PagedItemView } from "./PagedItemPresenter";


export class FeedPresenter extends StatusItemPresenter{
    
    public constructor(view: PagedItemView<Status>){
        super(view);
    }
    protected get view(): PagedItemView<Status> {
          return super.view as PagedItemView<Status>;
        }

      protected getMoreItems(authToken: AuthToken, user: User): Promise<[Status[], boolean]> {
              return this.service.loadMoreFeedItems(
                authToken,
                  user.alias,
                  PAGE_SIZE,
                  this.lastItem
              )
          }

      protected getItemDescription(): string{
            return "load feed";
          }
}