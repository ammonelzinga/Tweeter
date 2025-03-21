import { AuthToken, User} from "tweeter-shared";
import {UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE, PagedItemView } from "./PagedItemPresenter";


export class FollowerPresenter extends UserItemPresenter{

    protected getMoreItems(authToken: AuthToken, user: User): Promise<[User[], boolean]> {
        return this.service.loadMoreFollowers(authToken, user.alias,PAGE_SIZE,this.lastItem
        )
        }

    protected getItemDescription(): string{
      return "load followers";
        }  
}