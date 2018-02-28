(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdImageThingsThings", {
      templateUrl: imageThingsThingsTemplateUrl,
      controller: ImageThingsThingsController,
    });

 imageThingsThingsTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function imageThingsThingsTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.image_things_things_html;
  }    

  ImageThingsThingsController.$inject = ["$rootScope", 
                                         "$scope", 
                                         "spa-demo.subjects.imageThings"];
  function ImageThingsThingsController($rootScope, 
                                       $scope, 
                                       imageThings) {
    var vm=this;

    vm.$postLink = function() {
      $rootScope.$watch(
        function() { return imageThings.getRelatedThings(); }, 
        function(relatedThings) {
          vm.relatedThings = relatedThings;
          $scope.$parent.$parent.$ctrl.show = (vm.relatedThings.length > 0);
        }
      );    
    }    
    return;
    //////////////
 }
})();