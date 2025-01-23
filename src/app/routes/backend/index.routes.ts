import { Route } from "@angular/router";
import { DashboardPageApp } from "../../pages/backend/dashboard/index.component";

export const routes: Route[] = [
    {
        path: 'dashboard',
        title: 'Dashboard',
        component: DashboardPageApp
    }
]