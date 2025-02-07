import { Route } from "@angular/router";
import { DashboardPageApp } from "../../pages/backend/dashboard/index.component";
import { roleGuard } from "../../role.guard";
import { ROLE } from "../../services/authService/index.type";
import { UserPageApp } from "../../pages/backend/user/index.component";
import { CategoryPageApp } from "../../pages/backend/category/index.component";
import { QuizPageApp } from "../../pages/backend/quiz/index.component";

export const routes: Route[] = [
    {
        path: 'dashboard',
        title: 'Dashboard',
        component: DashboardPageApp,
        canActivate: [roleGuard],
        data: {role: [ROLE.SUPERADMIN, ROLE.ADMIN]}
    },
    {
        path: 'user',
        title: 'User',
        component: UserPageApp,
        canActivate: [roleGuard],
        data: {role: [ROLE.SUPERADMIN, ROLE.ADMIN]}
    },
    {
        path: 'category',
        title: 'Category',
        component: CategoryPageApp,
        canActivate: [roleGuard],
        data: {role: [ROLE.SUPERADMIN, ROLE.ADMIN]}
    },
    {
        path: 'quiz',
        title: 'Quiz',
        component: QuizPageApp,
        canActivate: [roleGuard],
        data: {role: [ROLE.SUPERADMIN, ROLE.ADMIN]}
    },
]