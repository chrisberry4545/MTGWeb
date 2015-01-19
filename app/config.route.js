(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());
    
    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'home',
                    settings: {
                        nav: 1,
                        content: '<i></i> Home'
                    }
                }
            }, {
                url: '/draftsim',
                config: {
                    title: 'draftsim',
                    templateUrl: 'app/draftsim/draftsim.html',
                    settings: {
                        nav: 2,
                        content: '<i></i> Draft Simulator'
                    }
                }
            }, {
                url: '/sealedsim',
                config: {
                    title: 'sealedsim',
                    templateUrl: 'app/sealedsim/sealedsim.html',
                    settings: {
                        nav: 3,
                        content: '<i></i> Sealed Simulator'
                    }
                }
            }, {
                url: '/browsecards',
                config: {
                    title: 'browsecards',
                    templateUrl: 'app/browsecards/browsecards.html',
                    settings: {
                        nav: 4,
                        content: '<i></i> Browse Cards'
                    }
                }
            }, {
                url: '/boostersim',
                config: {
                    title: 'boostersim',
                    templateUrl: 'app/boostersim/boostersim.html',
                    settings: {
                        nav: 5,
                        content: '<i></i> Booster Simulator'
                    }
                }
            }, {
                url: '/about',
                config: {
                    title: 'about',
                    templateUrl: 'app/about/about.html',
                    settings: {
                        nav: 6,
                        content: '<i></i> About'
                    }
                }
            }, {
                url: '/pickreport',
                config: {
                    title: 'pickreport',
                    templateUrl: 'app/highpickreport/highpickreport.html',
                    settings: {
                        nav: 7,
                        content: 'Pick Report'
                    }
                }
            }
            //, {
            //    url: '/multiplayerdraft',
            //    config: {
            //        title: 'multiplayerdraft',
            //        templateUrl: 'app/multiplayerdraft/multiplayerdraft.html',
            //        settings: {
            //            nav: 7,
            //            content: '<i></i> Multiplayer Draft'
            //        }
            //    }
            //}
            //,{
            //    url: '/admin',
            //    config: {
            //        title: 'admin',
            //        templateUrl: 'app/admin/admin.html',
            //        settings: {
            //            nav: 6,
            //            content: '<i></i> Admin'
            //        }
            //    }
            //}
        ];
    }
})();