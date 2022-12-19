/* Client related data/config */
export const appConfig = {
    INCLUDE_TRANSPORTATION_FINDER: true,
    INCLUDE_RESOURCES_FINDER: false,
    HIPAA_PRIVACY_NOTICE_URL: "/assets/doc/Hopelink_Privacy_Policy.pdf",
    ONE_CLICK_PRIVACY_POLICY_URL: "/assets/doc/Hopelink_Privacy_Policy.pdf",

    DEFAULT_LOCATION: {
        lat: 47.650626, 
        lng: -122.173341
      },
      
    AVAILABLE_LOCALES: [ 'en', 'es', 'pt', 'vi', 'ht', 'zh', 'fa'],
    DEFAULT_LOCALE: 'en',

    PARTICIPATING_COUNTIES_BORDER_COLOR: '#0000ff',

    SERVICES_ZIPCODES: [ ],
    TRANSPORTATION_ZIPCODES: [ ]
};