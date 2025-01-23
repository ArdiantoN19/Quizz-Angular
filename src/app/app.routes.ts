import { Route } from "@angular/router";
import { routes as frontendRoutes } from "./routes/frontend/index.routes";
import { routes as backendRoutes } from "./routes/backend/index.routes";
import { NotFoundAppComponent } from "./components/404/index.component";
import { FrontendLayoutAppComponent } from "./layouts/frontend/index.component";
import { BackendLayoutAppComponent } from "./layouts/backend/index.component";

export const routes: Route[] = [
    {
        path: '',
        component: FrontendLayoutAppComponent,
        children: frontendRoutes,
    },
    {
        path: 'admin',
        component: BackendLayoutAppComponent,
        children: backendRoutes,
    },
    {
        path: '**',
        component: NotFoundAppComponent
    }
]