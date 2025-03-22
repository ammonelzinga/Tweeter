import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../modelANDservice/service/FollowService";
import { MessageView, Presenter, View } from "./Presenter";

export interface UserInfoView extends MessageView{
    setDisplayedUser: (user: User) => void
}

export class UserInfoPresenter extends Presenter<UserInfoView>{
    private _isFollower = false;
    private _isFollowee = false;
    private _followeeCount = 0;
    private _followerCount = 0;
    private followService = new FollowService();
    private _isLoading: boolean = false;

    public constructor(view: UserInfoView){
        super(view);
    }

    public get isLoading(){
        return this._isLoading;
    }
    public set isLoading(value: boolean){
        this._isLoading = value;
    }

    public get isFollower(){
        return this._isFollower;
    }

    public get isFollowee(){
        return this._isFollowee;
    }
    public get followeeCount(){
        return this._followeeCount;
    }
    public get followerCount(){
        return this._followerCount;
    }

    public async setIsFollowerStatus (
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
      ) {
        this.doFailureReportingOperation(async () => { 
          if (currentUser === displayedUser) {
          this._isFollower = (false);
        } else {
          this._isFollower = (
            await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
          );
        }}, "determine follower status");
       
      };
    
    public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
      ) {
        this.doFailureReportingOperation(async () => {
          this._followeeCount = (await this.followService.getFolloweeCount(authToken, displayedUser));
        }, "get followees count");   
      };
    
    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
      ){
        this.doFailureReportingOperation(async () => {
          this._followerCount = (await this.followService.getFollowerCount(authToken, displayedUser));
        }, "get followers count");      
      };

    
    public async followDisplayedUser (
        authToken: AuthToken,
        displayedUser: User
      ): Promise<void> {

        this.doFailureReportingOperation(async () => {
          this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);
          const [followerCount, followeeCount] = await this.followService.follow(
            authToken!,
            displayedUser!
          );
    
          this._isFollower = (true);
          this._followerCount =(followerCount);
          this._followeeCount = (followeeCount);
        }, "follow user");

        this.view.clearLastInfoMessage();
      };
    
    
    public async unfollowDisplayedUser (
        authToken: AuthToken,
        displayedUser: User
      ): Promise<void> {
        this.doFailureReportingOperation(async () => {
          this.view.displayInfoMessage(
            `Unfollowing ${displayedUser!.name}...`,0);
    
          const [followerCount, followeeCount] = await this.followService.unfollow(authToken!,displayedUser!
          );
    
          this._isFollower = (false);
          this._followerCount = (followerCount);
          this._followeeCount = (followeeCount);
        }, "unfollow user");
          
        this.view.clearLastInfoMessage();
      };



}