import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../modelANDservice/service/UserService";
import { Buffer } from "buffer";
import { Presenter, View } from "./Presenter";



export interface RegisterView extends View{
    displayErrorMessage: (message: string) => void;
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
      ) => void, 
      navigate: (location: string) => void,
      setImageUrl: (url: string) => void
}

export class RegisterPresenter extends Presenter<RegisterView>{
    private userService: UserService;
    private _userImageBytes = new Uint8Array();
    private _imageFileExtension = "";

    public constructor(view: RegisterView){
        super(view);
        this.userService = new UserService();

    }
    public get userImageBytes(){
      return this._userImageBytes;
    }
    public get view() : RegisterView{
        return super.view as RegisterView;
    }

    public get imageFileExtension(){
      return this._imageFileExtension;
    }

    public async doRegister (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        rememberMe: boolean){
  
        this.doFailureReportingOperation(async () => {
            const [user, authToken] = await this.userService.register(
            firstName,
            lastName,
            alias,
            password,
            this._userImageBytes,
            this.imageFileExtension
          );
    
          this.view.updateUserInfo(user, user, authToken, rememberMe);
          this.view.navigate("/");
        }, "register user");
         
      };


      public handleImageFile (file: File | undefined) {
          if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));
      
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
              const imageStringBase64 = event.target?.result as string;
      
              // Remove unnecessary file metadata from the start of the string.
              const imageStringBase64BufferContents =
                imageStringBase64.split("base64,")[1];
      
              const bytes: Uint8Array<ArrayBuffer> = Buffer.from(
                imageStringBase64BufferContents,
                "base64"
              );
      
              this._userImageBytes = bytes;
            };
            reader.readAsDataURL(file);
      
            // Set image file extension (and move to a separate method)
            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
              this._imageFileExtension = (fileExtension);
            }
          } else {
            this.view.setImageUrl("");
            this._userImageBytes = (new Uint8Array());
          }
        };
      
        public getFileExtension = (file: File): string | undefined => {
          return file.name.split(".").pop();
        };
}