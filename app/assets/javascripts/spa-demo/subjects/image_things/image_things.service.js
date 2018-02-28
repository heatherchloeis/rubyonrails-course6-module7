(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .service("spa-demo.subjects.imageThings", ImageThings);

  ImageThings.$inject = ["$resource", 
                         "spa-demo.config.APP_CONFIG", 
                         "spa-demo.subjects.Thing"];

  function ImageThings($resource, APP_CONFIG, Thing) {
    var subjectsResource = $resource(APP_CONFIG.server_url + "/api/subjects",{},{
      query: { cache:false, isArray:true }
    });
    var thingImagesResource = $resource(APP_CONFIG.server_url + "/api/images/:image_id/thing_images",
      { image_id: '@image_id' },
      {}
    );

    var service = this;
    service.images = [];
    service.imageId = null;
    service.isCurrentImageId = isCurrentImageId;
    service.setCurrentImage = setCurrentImage;
    service.things = [];
    service.relatedThings = [];

    loadImages();
    loadThings();

    return;
    ////////////////

    function loadImages() {
      var result=subjectsResource.query(angular.copy(APP_CONFIG.default_position));
      result.$promise.then(
        function(images){
          var imageIds = [];
          for (var i=0; i<images.length; i++) {
            var image = images[i];
            if(imageIds.indexOf(image["image_id"]) == -1) {
              imageIds.push(image["image_id"]);
              service.images.push(image);
            }
          }
        });
      return result.$promise;
    }

    function loadThings() {
      var params = angular.copy(APP_CONFIG.default_position);
      params["subject"]="thing";
      var result=subjectsResource.query(params);
      result.$promise.then(
        function(things){
          service.things=things;
        }).then(
          function(things) {
            for (var i=0; i<service.things.length; i++) {
              Thing.get({id:service.things[i].thing_id}).$promise.then(
                function(thing) {
                  for(var j=0; j<service.things.length; j++) {
                    if(service.things[j].thing_id == thing.id) {
                      service.things[j].description = thing.description;
                    }
                  }
              });
            }
        });
      return result.$promise;
    }

    function isCurrentImageId(imageId) {
      return service.imageId === imageId;
    }

    function setCurrentImage(imageId) {
      service.imageId = imageId;
      var newRelatedThings = [];
      service.relatedThings = [];
      var params = {};
      params["image_id"] = imageId;
      var result = thingImagesResource.query(params);
      result.$promise.then(
        function(thingImages) {
          for (var i=0; i<service.things.length; i++) {
            for(var j=0; j<thingImages.length; j++) {
              var thing=service.things[i];
              if(thing["thing_id"] == thingImages[j]["thing_id"]) {
                newRelatedThings.push(thing);
              }
            }
          }
          service.relatedThings = newRelatedThings;
       });
    }
  }

  ImageThings.prototype.getImages = function() {
    return this.images;
  }
  ImageThings.prototype.getThings = function() {
    return this.things;
  }
  ImageThings.prototype.getRelatedThings = function() {
    return this.relatedThings;
  }

})();