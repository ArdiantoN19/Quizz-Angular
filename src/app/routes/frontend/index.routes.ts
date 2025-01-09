import { Route } from '@angular/router';
import { HomePageApp } from '../../pages/frontend/home/index.component';
import { FeaturePageApp } from '../../pages/frontend/feature/index.component';
import { AboutUsPageApp } from '../../pages/frontend/aboutUs/index.component';
import { ContactUsPageApp } from '../../pages/frontend/contactUs/index.component';
import { LoginAppComponent } from '../../components/auth/login/index.component';
import { RegisterAppComponent } from '../../components/auth/register/index.component';

export const routes: Route[] = [
  {
    path: '',
    title: 'Home-quizz',
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
  },
  {
    path: 'register',
    title: 'register-quizz',
    component: RegisterAppComponent,
  },
];
