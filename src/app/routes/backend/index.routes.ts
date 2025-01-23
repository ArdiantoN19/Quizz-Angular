import { Route } from "@angular/router";
import { DashboardPageApp } from "../../pages/backend/dashboard/index.component";
import { roleGuard } from "../../role.guard";
import { ROLE } from "../../services/authService/index.type";

export const routes: Route[] = [
    {
        path: 'dashboard',
        title: 'Dashboard',
        component: DashboardPageApp,
        canActivate: [roleGuard],
        data: {role: [ROLE.SUPERADMIN, ROLE.ADMIN]}
    }
]