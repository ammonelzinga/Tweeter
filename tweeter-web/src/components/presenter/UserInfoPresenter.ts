import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../modelANDservice/service/FollowService";

export interface UserInfoView{
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void;
    clearLastInfoMessage: () => void;
    setDisplayedUser: (user: User) => void
}

export class UserInfoPresenter{
    private _isFollower = false;
    private _isFollowee = false;
    private _followeeCount = 0;
    private _followerCount = 0;
    private followService = new FollowService();
    private view: UserInfoView;
    private _isLoading: boolean = false;

    public constructor(view: UserInfoView){
        this.view = view;
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
        try {
          if (currentUser === displayedUser) {
            this._isFollower = (false);
          } else {
            this._isFollower = (
              await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to determine follower status because of exception: ${error}`
          );
        }
      };
    
      public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
      ) {
        try {
          this._followeeCount = (await this.followService.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to get followees count because of exception: ${error}`
          );
        }
      };
    
      public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
      ){
        try {
            this._followerCount = (await this.followService.getFollowerCount(authToken, displayedUser));
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to get followers count because of exception: ${error}`
          );
        }
      };
    
      public async followDisplayedUser (
        event: React.MouseEvent,
        authToken: AuthToken,
        displayedUser: User
      ): Promise<void> {
        event.preventDefault();
    
        try {
          this._isLoading = (true);
          this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);
    
          const [followerCount, followeeCount] = await this.followService.follow(
            authToken!,
            displayedUser!
          );
    
          this._isFollower = (true);
          this._followerCount =(followerCount);
          this._followeeCount = (followeeCount);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to follow user because of exception: ${error}`
          );
        } finally {
          this.view.clearLastInfoMessage();
          this._isLoading = (false);
        }
      };
    
    
      public async unfollowDisplayedUser (
        event: React.MouseEvent,
        authToken: AuthToken,
        displayedUser: User
      ): Promise<void> {
        event.preventDefault();
    
        try {
          this._isLoading = (true);
          this.view.displayInfoMessage(
            `Unfollowing ${displayedUser!.name}...`,
            0
          );
    
          const [followerCount, followeeCount] = await this.followService.unfollow(
            authToken!,
            displayedUser!
          );
    
          this._isFollower = (false);
          this._followerCount = (followerCount);
          this._followeeCount = (followeeCount);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to unfollow user because of exception: ${error}`
          );
        } finally {
          this.view.clearLastInfoMessage();
          this._isLoading = (false);
        }
      };



}