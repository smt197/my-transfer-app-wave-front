import { Routes,RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard, noAuthGuard } from './guards/auth.guard';


export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' } 
];

