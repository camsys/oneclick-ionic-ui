/* Client related data/config */
export const appConfig = {
    INCLUDE_TRANSPORTATION_FINDER: true,
    INCLUDE_RESOURCES_FINDER: false,
    INCLUDE_FARE_COST: false,
    HIPAA_PRIVACY_NOTICE_URL: "https://ieuw-bin.s3.us-east-2.amazonaws.com/211-Ride-HIPAA-Privacy-Notice.pdf",
    ONE_CLICK_PRIVACY_POLICY_URL: "http://www.example.com",

    DEFAULT_LOCATION: {
        lat: 42.6639459, 
        lng: -77.5484864
      },
      
    AVAILABLE_LOCALES: [ 'en' ],
    DEFAULT_LOCALE: 'en',

    PARTICIPATING_COUNTIES_BORDER_COLOR: '#0000ff',

    SERVICES_ZIPCODES: [ ],
    TRANSPORTATION_ZIPCODES: [ ]
};