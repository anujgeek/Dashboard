//Main Module

angular.module('MainModule', ['ngRoute', 'AboutModule', 'DemoModule', 'FiltersModule']);

//Common Modules

angular.module('FiltersModule', []);
angular.module('DirectivesModule', []);

//Component Modules

angular.module('AboutModule', []);
angular.module('DemoModule', ['kendo.directives', 'DirectivesModule']);