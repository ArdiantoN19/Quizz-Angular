import { Route } from "@angular/router";
import { routes as frontendRoutes } from "./routes/frontend/frontend.routes";
import { routes as backendRoutes } from "./routes/backend/backend.routes";
import { NotFoundAppComponent } from "./components/404/404-notfound.component";
import { LayoutFrontendAppComponent } from "./layouts/frontend/frontend.component";
import { LayoutBackendAppComponent } from "./layouts/backend/backend.component";

export const routes: Route[] = [
    {
        path: '',
        component: LayoutFrontendAppComponent,
        children: frontendRoutes,
    },
    {
        path: 'admin',
        component: LayoutBackendAppComponent,
        children: backendRoutes,
    },
    {
        path: '**',
        component: NotFoundAppComponent
    }
]