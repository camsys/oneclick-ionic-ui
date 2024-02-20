/* Client related data/config */
export const appConfig = {
    INCLUDE_TRANSPORTATION_FINDER: true,
    INCLUDE_RESOURCES_FINDER: false,
    INCLUDE_FARE_COST: false,
    INCLUDE_PARATRANSIT_ID: false,
    DEFAULT_ROUTE: 'locator/transportation',
    HIPAA_PRIVACY_NOTICE_URL: "/assets/doc/Hopelink_Privacy_Policy.pdf",
    ONE_CLICK_PRIVACY_POLICY_URL: "/assets/doc/Hopelink_Privacy_Policy.pdf",
    HELP_EXT_URL: false,
    HOME_EXT_URL: "https://www.FindARide.org/TripPlanner",

    DEFAULT_LOCATION: {
        lat: 47.650626,
        lng: -122.173341
      },
    INITIAL_ZOOM_LEVEL: 8,

    AVAILABLE_LOCALES: [ 'en', 'es', 'zh', 'ko', 'vi', 'tl', 'so', 'am', 'ti', 'ru', 'uk', 'fr', 'pa', 'hi', 'ja', 'km'],
    DEFAULT_LOCALE: 'en',

    PARTICIPATING_COUNTIES_BORDER_COLOR: '#0000ff',

    SERVICES_ZIPCODES: [98009,98042,98546,98126,98203,98103,98117,98247,98274,98253,98930,98564,98828,98828,98220,98089,98062,98950,98027,98073,98408,98354,98354,98109,98115,98119,98422,98422,98591,98342,98407,98572,98195,98010,98388,98191,98255,98032,98058,98064,98387,98592,98312,98312,98333,98346,98104,98105,98508,98421,98229,98229,98941,98063,98139,98438,98004,98038,98051,98077,98077,98570,98304,98304,98329,98329,98168,98221,98145,98444,98416,98943,98061,98493,98372,98372,98338,98148,98188,98498,98433,98507,98232,98270,98907,98291,98852,98511,98008,98001,98045,98053,98059,98396,98332,98277,98366,98199,98201,98445,98467,98249,98240,98288,98330,98330,98056,98047,98047,98580,98284,98284,98116,98516,98248,98264,98417,98936,99322,98582,98344,98447,98548,98321,98165,98122,98164,98092,98092,98503,98272,98276,98933,98158,98939,98533,98413,98568,98568,98282,98282,98144,98466,98443,98512,98908,98935,98937,98937,98411,98464,98430,98293,98026,98380,98380,98314,98327,98177,98177,98237,98237,98944,98807,98170,98490,98560,98544,98181,98012,98030,98065,98375,98597,98349,98223,98901,98901,98585,98278,98448,98530,98025,98556,98057,98371,98155,98226,98236,98925,98256,98024,98406,98392,98166,98146,98225,98926,98393,98555,98952,98355,98033,98074,98558,98133,98513,98252,98260,98812,98129,98228,98920,98075,98563,98589,98506,98111,98817,98028,98028,98082,98370,98405,98496,98258,98909,98035,98353,98015,98070,98404,98532,98311,98194,98101,98499,98501,98424,98822,98942,98922,98540,98262,98231,98946,98263,98836,98364,98287,98207,98397,98131,98021,98031,98002,98383,98340,98934,98224,98050,98114,98409,98275,98227,98161,98014,98040,98373,98826,98948,98235,98923,98565,98505,98007,98052,98391,98538,98584,98557,98328,98110,98110,98102,98230,98816,98596,98847,98267,98811,98043,98036,98178,98524,98271,98251,98251,98509,98206,98348,98259,98185,98384,98019,98019,98029,98198,98106,98273,98266,98831,98846,98593,98938,98174,98127,98041,98395,98921,98003,98072,98072,98579,98579,98295,98360,98112,98233,98815,98903,98588,98356,98068,98068,98352,98386,98011,98011,98087,98403,98292,98292,98335,98361,98303,98136,98502,98502,98257,98932,98039,98283,98283,98138,98071,98238,98083,98398,98005,98390,98528,98528,98528,98290,98281,98208,98124,98121,98446,98418,98801,98940,98345,98542,98322,98431,98006,98037,98402,98351,98107,98239,98394,98315,98385,98093,98310,98359,98359,98296,98241,98241,98244,98953,98951,99350,98336,98213,98821,98034,98055,98374,98531,98531,98337,98294,98154,98323,98419,98020,98022,98022,98046,98377,98367,98576,98541,98125,98108,98902,98947,98465,98401,98113,98023,98023,98134,98204,98118,98439,98175,98539,98522 ],
    TRANSPORTATION_ZIPCODES: [98009,98042,98546,98126,98203,98103,98117,98247,98274,98253,98930,98564,98828,98828,98220,98089,98062,98950,98027,98073,98408,98354,98354,98109,98115,98119,98422,98422,98591,98342,98407,98572,98195,98010,98388,98191,98255,98032,98058,98064,98387,98592,98312,98312,98333,98346,98104,98105,98508,98421,98229,98229,98941,98063,98139,98438,98004,98038,98051,98077,98077,98570,98304,98304,98329,98329,98168,98221,98145,98444,98416,98943,98061,98493,98372,98372,98338,98148,98188,98498,98433,98507,98232,98270,98907,98291,98852,98511,98008,98001,98045,98053,98059,98396,98332,98277,98366,98199,98201,98445,98467,98249,98240,98288,98330,98330,98056,98047,98047,98580,98284,98284,98116,98516,98248,98264,98417,98936,99322,98582,98344,98447,98548,98321,98165,98122,98164,98092,98092,98503,98272,98276,98933,98158,98939,98533,98413,98568,98568,98282,98282,98144,98466,98443,98512,98908,98935,98937,98937,98411,98464,98430,98293,98026,98380,98380,98314,98327,98177,98177,98237,98237,98944,98807,98170,98490,98560,98544,98181,98012,98030,98065,98375,98597,98349,98223,98901,98901,98585,98278,98448,98530,98025,98556,98057,98371,98155,98226,98236,98925,98256,98024,98406,98392,98166,98146,98225,98926,98393,98555,98952,98355,98033,98074,98558,98133,98513,98252,98260,98812,98129,98228,98920,98075,98563,98589,98506,98111,98817,98028,98028,98082,98370,98405,98496,98258,98909,98035,98353,98015,98070,98404,98532,98311,98194,98101,98499,98501,98424,98822,98942,98922,98540,98262,98231,98946,98263,98836,98364,98287,98207,98397,98131,98021,98031,98002,98383,98340,98934,98224,98050,98114,98409,98275,98227,98161,98014,98040,98373,98826,98948,98235,98923,98565,98505,98007,98052,98391,98538,98584,98557,98328,98110,98110,98102,98230,98816,98596,98847,98267,98811,98043,98036,98178,98524,98271,98251,98251,98509,98206,98348,98259,98185,98384,98019,98019,98029,98198,98106,98273,98266,98831,98846,98593,98938,98174,98127,98041,98395,98921,98003,98072,98072,98579,98579,98295,98360,98112,98233,98815,98903,98588,98356,98068,98068,98352,98386,98011,98011,98087,98403,98292,98292,98335,98361,98303,98136,98502,98502,98257,98932,98039,98283,98283,98138,98071,98238,98083,98398,98005,98390,98528,98528,98528,98290,98281,98208,98124,98121,98446,98418,98801,98940,98345,98542,98322,98431,98006,98037,98402,98351,98107,98239,98394,98315,98385,98093,98310,98359,98359,98296,98241,98241,98244,98953,98951,99350,98336,98213,98821,98034,98055,98374,98531,98531,98337,98294,98154,98323,98419,98020,98022,98022,98046,98377,98367,98576,98541,98125,98108,98902,98947,98465,98401,98113,98023,98023,98134,98204,98118,98439,98175,98539,98522 ]
};
