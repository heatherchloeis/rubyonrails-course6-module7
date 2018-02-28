(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdImageThingsImages", {
      templateUrl: imageThingsImagesTemplateUrl,
      controller: ImageThingsImagesController,
    });

 imageThingsImagesTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function imageThingsImagesTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.image_things_images_html;
  }    

  ImageThingsImagesController.$inject = ["$scope", 
                                         "spa-demo.subjects.imageThings"];
  function ImageThingsImagesController($scope, 
                                       imageThings) {
    var vm=this;
    vm.imageClicked = imageClicked;
    vm.isCurrentImage = imageThings.isCurrentImageId;

    vm.$postLink = function() {
      $scope.$watch(
        function() { return imageThings.getImages(); }, 
        function(images) { vm.images = images; }
      );
    }    
    return;
    //////////////
    function imageClicked(imageId) {
      $scope.$parent.$parent.$parent.$ctrl.areasController.showAll("right");
      imageThings.setCurrentImage(imageId);
    }
 }
})();