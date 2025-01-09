import { Route } from "@angular/router";
import { routes as frontendRoutes } from "./routes/frontend/index.routes";
import { NotFoundAppComponent } from "./components/404/index.component";

export const routes: Route[] = [
    {
        path: '',
        children: frontendRoutes
    },
    {
        path: '**',
        component: NotFoundAppComponent
    }
]