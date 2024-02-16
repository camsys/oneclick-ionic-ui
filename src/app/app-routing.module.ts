import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule, Routes } from '@angular/router';
import { appConfig } from '../environments/appConfig';

const routes: Routes = [
  {
    path: '',
    redirectTo: appConfig.DEFAULT_ROUTE,
    pathMatch: 'full'
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/211/categories-for211/categories-for211.module').then( m => m.CategoriesFor211PageModule)
  },
  {
    path: 'service_detail',
    loadChildren: () => import('./pages/211/service-for211-detail/service-for211-detail.module').then( m => m.ServiceFor211DetailPageModule)
  },
  {
    path: 'service_detail/:service_id/:location_id',
    loadChildren: () => import('./pages/211/service-for211-detail/service-for211-detail.module').then( m => m.ServiceFor211DetailPageModule)
  },
  {
    path: 'services/:code',
    loadChildren: () => import('./pages/211/services/services.module').then( m => m.ServicesPageModule)
  },
  {
    path: 'sub_sub_categories/:code',
    loadChildren: () => import('./pages/211/sub-subcategories-for211/sub-subcategories-for211.module').then( m => m.SubSubcategoriesFor211PageModule)
  },
  {
    path: 'sub_categories',
    loadChildren: () => import('./pages/211/subcategories-for211/subcategories-for211.module').then( m => m.SubcategoriesFor211PageModule)
  },
  {
    path: 'sub_categories/:code',
    loadChildren: () => import('./pages/211/subcategories-for211/subcategories-for211.module').then( m => m.SubcategoriesFor211PageModule)
  },
  {
    path: 'about_us',
    loadChildren: () => import('./pages/about-us/about-us.module').then( m => m.AboutUsPageModule)
  },
  {
    path: 'contact_us',
    loadChildren: () => import('./pages/contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'trip_directions/:trip_id',
    loadChildren: () => import('./pages/directions/directions.module').then( m => m.DirectionsPageModule)
  },
  {
    path: 'feedback_status',
    loadChildren: () => import('./pages/feedback-status/feedback-status.module').then( m => m.FeedbackStatusPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/help-me-find/help-me-find.module').then( m => m.HelpMeFindPageModule)
  },
  {
    path: 'paratransit_services',
    loadChildren: () => import('./pages/paratransit-services/paratransit-services.module').then( m => m.ParatransitServicesPageModule)
  },
  {
    path: 'paratransit_services/:trip_id',
    loadChildren: () => import('./pages/paratransit-services/paratransit-services.module').then( m => m.ParatransitServicesPageModule)
  },
  {
    path: 'resend_email_confirmation',
    loadChildren: () => import('./pages/resend-email-confirmation/resend-email-confirmation.module').then( m => m.ResendEmailConfirmationPageModule)
  },
  {
    path: 'reset_password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'sign_in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'sign_up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'taxi_services/:trip_id',
    loadChildren: () => import('./pages/taxi-services/taxi-services.module').then( m => m.TaxiServicesPageModule)
  },
  {
    path: 'transportation_eligibility/:trip_id',
    loadChildren: () => import('./pages/transportation-eligibility/transportation-eligibility.module').then( m => m.TransportationEligibilityPageModule)
  },
  {
    path: 'trip_options',
    loadChildren: () => import('./pages/trip-response/trip-response.module').then( m => m.TripResponsePageModule)
  },
  {
    path: 'trip_options/:trip_id',
    loadChildren: () => import('./pages/trip-response/trip-response.module').then( m => m.TripResponsePageModule)
  },
  {
    path: 'trip_options/:service_id/:location_id',
    loadChildren: () => import('./pages/trip-response/trip-response.module').then( m => m.TripResponsePageModule)
  },
  {
    path: 'trip_options/:trip_id/:service_id/:location_id',
    loadChildren: () => import('./pages/trip-response/trip-response.module').then( m => m.TripResponsePageModule)
  },
  {
    path: 'unsubscribe/:email',
    loadChildren: () => import('./pages/unsubscribe/unsubscribe.module').then( m => m.UnsubscribePageModule)
  },
  {
    path: 'locator/:viewType',
    loadChildren: () => import('./pages/user-locator/user-locator.module').then( m => m.UserLocatorPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
