import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { Status, User } from "tweeter-shared";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./components/presenter/FolloweePresenter";
import { FollowerPresenter } from "./components/presenter/FollowerPresenter";
import { FeedPresenter } from "./components/presenter/FeedPresenter";
import { StoryPresenter } from "./components/presenter/StoryPresenter";
import ItemScroller, { itemProps } from "./components/mainLayout/ItemScroller";
import { PagedItemView } from "./components/presenter/PagedItemPresenter";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { StatusService } from "./components/modelANDservice/service/StatusService";
import { FollowService } from "./components/modelANDservice/service/FollowService";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
 

  

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route 
          path="feed" 
          element={
          <ItemScroller<Status, StatusService>
              key = {"feedScroller"}
              presenterGenerator={(view: PagedItemView<Status>) => new FeedPresenter(view)}
              itemComponentGenerator={(itemProp: itemProps<Status>) => {
                const currentItem= itemProp.item;
              return <StatusItem status={currentItem} />}}
              />
            } 
          />
        <Route 
          path="story"
          element={
            <ItemScroller<Status, StatusService>
              key = {"storyScroller"}
              presenterGenerator={(view: PagedItemView<Status>) => new StoryPresenter(view)}
              itemComponentGenerator={(itemProp: itemProps<Status>) => {
                const currentItem= itemProp.item;
              return <StatusItem status={currentItem} />}}
            />
          } 
         />
        <Route
          path="followees"
          element={
            <ItemScroller<User, FollowService>
              key={"followeeScroller"}
              presenterGenerator={(view: PagedItemView<User>) => new FolloweePresenter(view)}
              itemComponentGenerator={(itemProp: itemProps<User>) => {
                const currentItem= itemProp.item;
              return <UserItem value={currentItem} />}}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller<User, FollowService>
              key={"FollowerScroller"} 
                presenterGenerator={(view: PagedItemView<User>) => new FollowerPresenter(view)}
                itemComponentGenerator={(itemProp: itemProps<User>) => {
                const currentItem= itemProp.item;
                return <UserItem value={currentItem} />}}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
