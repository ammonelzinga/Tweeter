import {
    PagedUserItemRequest,
    PagedUserItemResponse,
    User,
    UserDto,
  } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator/ClientCommunicator";
  
  export class ServerFacade {
    private SERVER_URL = "https://2wcpnst6z6.execute-api.us-west-2.amazonaws.com/dev";
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  
    public async getMoreFollowees(
      request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedUserItemRequest,
        PagedUserItemResponse
      >(request, "/followee/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto: UserDto) => User.fromDto(dto) as User)
          : null;
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No followees found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message!);
      }
    }
  }