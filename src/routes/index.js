import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import RegitserPage from "../pages/RegisterPage"
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import MessagePage from "../components/MessagePage";
import Home from "../pages/Home";
import AuthLayouts from "../layouts/AuthLayouts";
import AddUsersPage from "../pages/AddUsersPage";

const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [{
        path: "register",
        element: <AuthLayouts><RegitserPage /></AuthLayouts>
    },{
        path: "email",
        element:  <AuthLayouts><CheckEmailPage /></AuthLayouts>
    },{
        path: "password",
        element: <AuthLayouts><CheckPasswordPage /></AuthLayouts>
    },{
        path: "",
        element: <Home />,
        children: [{
            path: ":userId",
            element: <MessagePage />
        }]
    },{
        path: "/add-users",
        element: <AuthLayouts><AddUsersPage /></AuthLayouts>
    }]
}]);

export default router;