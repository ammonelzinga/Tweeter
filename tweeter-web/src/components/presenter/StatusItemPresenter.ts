import { AuthToken, Status } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";
import { StatusService } from "../modelANDservice/service/StatusService";


//export interface StatusItemView extends PagedItemView<StatusItemView>{}

export abstract class StatusItemPresenter extends PagedItemPresenter<Status, StatusService>{
        
        protected createService(): StatusService{
            return new StatusService;
        }


}