import { Route } from "@angular/router";
import { routes as frontendRoutes } from "./routes/frontend/index.routes";

export const routes: Route[] = [
    {
        path: '',
        children: frontendRoutes
    }
]