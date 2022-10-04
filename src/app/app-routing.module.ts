import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'categories-for211',
    loadChildren: () => import('./pages/211/categories-for211/categories-for211.module').then( m => m.CategoriesFor211PageModule)
  },
  {
    path: 'service-for211-detail',
    loadChildren: () => import('./pages/211/service-for211-detail/service-for211-detail.module').then( m => m.ServiceFor211DetailPageModule)
  },
  {
    path: 'service-for211-modal',
    loadChildren: () => import('./pages/211/service-for211-modal/service-for211-modal.module').then( m => m.ServiceFor211ModalPageModule)
  },
  {
    path: 'services',
    loadChildren: () => import('./pages/211/services/services.module').then( m => m.ServicesPageModule)
  },
  {
    path: 'services-list-tab',
    loadChildren: () => import('./pages/211/services-list-tab/services-list-tab.module').then( m => m.ServicesListTabPageModule)
  },
  {
    path: 'services-map-tab',
    loadChildren: () => import('./pages/211/services-map-tab/services-map-tab.module').then( m => m.ServicesMapTabPageModule)
  },
  {
    path: 'sub-subcategories-for211',
    loadChildren: () => import('./pages/211/sub-subcategories-for211/sub-subcategories-for211.module').then( m => m.SubSubcategoriesFor211PageModule)
  },
  {
    path: 'subcategories-for211',
    loadChildren: () => import('./pages/211/subcategories-for211/subcategories-for211.module').then( m => m.SubcategoriesFor211PageModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./pages/about-us/about-us.module').then( m => m.AboutUsPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./pages/contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'directions',
    loadChildren: () => import('./pages/directions/directions.module').then( m => m.DirectionsPageModule)
  },
  {
    path: 'directions-map-tab',
    loadChildren: () => import('./pages/directions-map-tab/directions-map-tab.module').then( m => m.DirectionsMapTabPageModule)
  },
  {
    path: 'directions-steps-tab',
    loadChildren: () => import('./pages/directions-steps-tab/directions-steps-tab.module').then( m => m.DirectionsStepsTabPageModule)
  },
  {
    path: 'email-itinerary-modal',
    loadChildren: () => import('./pages/email-itinerary-modal/email-itinerary-modal.module').then( m => m.EmailItineraryModalPageModule)
  },
  {
    path: 'email-modal',
    loadChildren: () => import('./pages/email-modal/email-modal.module').then( m => m.EmailModalPageModule)
  },
  {
    path: 'feedback-modal',
    loadChildren: () => import('./pages/feedback-modal/feedback-modal.module').then( m => m.FeedbackModalPageModule)
  },
  {
    path: 'feedback-status',
    loadChildren: () => import('./pages/feedback-status/feedback-status.module').then( m => m.FeedbackStatusPageModule)
  },
  {
    path: 'help-me-find',
    loadChildren: () => import('./pages/help-me-find/help-me-find.module').then( m => m.HelpMeFindPageModule)
  },
  {
    path: 'language-selector-modal',
    loadChildren: () => import('./pages/language-selector-modal/language-selector-modal.module').then( m => m.LanguageSelectorModalPageModule)
  },
  {
    path: 'paratransit-services',
    loadChildren: () => import('./pages/paratransit-services/paratransit-services.module').then( m => m.ParatransitServicesPageModule)
  },
  {
    path: 'resend-email-confirmation',
    loadChildren: () => import('./pages/resend-email-confirmation/resend-email-confirmation.module').then( m => m.ResendEmailConfirmationPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'sms-modal',
    loadChildren: () => import('./pages/sms-modal/sms-modal.module').then( m => m.SmsModalPageModule)
  },
  {
    path: 'taxi-services',
    loadChildren: () => import('./pages/taxi-services/taxi-services.module').then( m => m.TaxiServicesPageModule)
  },
  {
    path: 'transportation-eligibility',
    loadChildren: () => import('./pages/transportation-eligibility/transportation-eligibility.module').then( m => m.TransportationEligibilityPageModule)
  },
  {
    path: 'trip-response',
    loadChildren: () => import('./pages/trip-response/trip-response.module').then( m => m.TripResponsePageModule)
  },
  {
    path: 'unsubscribe',
    loadChildren: () => import('./pages/unsubscribe/unsubscribe.module').then( m => m.UnsubscribePageModule)
  },
  {
    path: 'user-locator',
    loadChildren: () => import('./pages/user-locator/user-locator.module').then( m => m.UserLocatorPageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./pages/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
