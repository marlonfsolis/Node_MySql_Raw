import {Express} from "express";

import * as ErrorController from "../controllers/errorController";
import {debug} from "./debuggers";

import routes_index from "../routes/index";
import routes_users from "../routes/users";
import permission_routes from "../routes/permissionRoutes";
import role_routes from "../routes/roleRoutes";


const routesLoader = (app: Express) => {
    debug("Loading routes...");

    app.use("/api", routes_index);
    app.use("/api/users", routes_users);
    app.use("/api/permissions", permission_routes);
    app.use("/api/roles", role_routes);

    app.use("*", ErrorController.pageNotFound);
    app.use(ErrorController.errorNotHandled);

    debug("Routes loaded.");
};

export default routesLoader;
