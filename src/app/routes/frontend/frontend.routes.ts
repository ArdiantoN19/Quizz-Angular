import { Route } from '@angular/router';
import { HomePageApp } from '../../pages/frontend/home/home.component';
import { FeaturePageApp } from '../../pages/frontend/feature/feature.component';
import { AboutUsPageApp } from '../../pages/frontend/about-us/about-us.component';
import { ContactUsPageApp } from '../../pages/frontend/contact-us/contact-us.component';
import { LoginAppComponent } from '../../components/auth/login/login.component';
import { RegisterAppComponent } from '../../components/auth/register/register.component';
import { roleGuard } from '../../role.guard';
import { ROLE } from '../../services/auth/auth.type';

export const routes: Route[] = [
  {
    path: '',
    title: 'home-quizz',
    component: HomePageApp,
  },
  {
    path: 'home',
    redirectTo: '',
  },
  {
    path: 'feature',
    title: 'features-quizz',
    component: FeaturePageApp,
    canActivate: [roleGuard],
    data: {role: ROLE.USER}
  },
  {
    path: 'about-us',
    title: 'about-us-quizz',
    component: AboutUsPageApp,
  },
  {
    path: 'contact-us',
    title: 'contact-us-quizz',
    component: ContactUsPageApp,
  },
  {
    path: 'login',
    title: 'login-quizz',
    component: LoginAppComponent,
    canActivate: [roleGuard],
  },
  {
    path: 'register',
    title: 'register-quizz',
    component: RegisterAppComponent,
    canActivate: [roleGuard],
  },
];
