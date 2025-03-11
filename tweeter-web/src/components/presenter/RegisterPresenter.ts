import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../modelANDservice/service/UserService";
import useUserInfo from "../userInfo/UserInfoHook";
import { Buffer } from "buffer";



export interface RegisterView{
    displayErrorMessage: (message: string) => void;
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
      ) => void, 
      navigate: (location: string) => void, 
      setImageUrl: (value: React.SetStateAction<string>) => void, 
      setImageBytes: (value: React.SetStateAction<Uint8Array<ArrayBufferLike>>) => void, 
      setImageFileExtension: (value: React.SetStateAction<string>) => void
}

export class RegisterPresenter{
    private _view: RegisterView;
    private userService: UserService;
    private _isLoading = false;

    public constructor(view: RegisterView){
        this._view = view;
        this.userService = new UserService();

    }
    public get view(){
        return this._view;
    }

    public get isLoading(){
        return this._isLoading;
    }
    public set isLoading(value: boolean){
        this._isLoading = value;
    }
    //const { updateUserInfo } = useUserInfo();
    public async doRegister (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string, 
        rememberMe: boolean){
        
        
        try {
          this._isLoading = true;
    
          const [user, authToken] = await this.userService.register(
            firstName,
            lastName,
            alias,
            password,
            userImageBytes,
            imageFileExtension
          );
    
          this._view.updateUserInfo(user, user, authToken, rememberMe);
          this._view.navigate("/");
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to register user because of exception: ${error}`
          );
        } finally {
          this._isLoading = (false);
        }
      };


      public handleImageFile (file: File | undefined) {
          if (file) {
            this._view.setImageUrl(URL.createObjectURL(file));
      
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
              const imageStringBase64 = event.target?.result as string;
      
              // Remove unnecessary file metadata from the start of the string.
              const imageStringBase64BufferContents =
                imageStringBase64.split("base64,")[1];
      
              const bytes: Uint8Array = Buffer.from(
                imageStringBase64BufferContents,
                "base64"
              );
      
              this._view.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);
      
            // Set image file extension (and move to a separate method)
            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
              this._view.setImageFileExtension(fileExtension);
            }
          } else {
            this._view.setImageUrl("");
            this._view.setImageBytes(new Uint8Array());
          }
        };
      
        public getFileExtension = (file: File): string | undefined => {
          return file.name.split(".").pop();
        };
}