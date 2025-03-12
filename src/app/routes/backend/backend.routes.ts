import { Route } from "@angular/router";
import { DashboardPageApp } from "../../pages/backend/dashboard/dashboard.component";
import { roleGuard } from "../../role.guard";
import { ROLE } from "../../services/auth/auth.type";
import { UserPageApp } from "../../pages/backend/user/user.component";
import { CategoryPageApp } from "../../pages/backend/category/category.component";
import { QuizPageApp } from "../../pages/backend/quiz/quiz.component";
import { AddQuizPageApp } from "../../pages/backend/quiz/add/add.component";

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
        canActivate: [roleGuard],
        data: {role: [ROLE.SUPERADMIN, ROLE.ADMIN]},
        children: [
            {
                path: '',
                title: 'Quiz',
                component: QuizPageApp,
            },
            {
                path: 'add',
                title: 'Add Quiz',
                component: AddQuizPageApp
            }
        ]
    },
]