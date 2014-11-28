(function() {
    'use strict';

    var serviceId = 'cardmodel'

    angular.module('app').factory(serviceId, cardmodel);

    function cardmodel()
    {
        var service = {
            configureMetadataStore: configureMetadataStore
        };

        return service;

        function configureMetadataStore(metadataStore) {

        }
    }

}());