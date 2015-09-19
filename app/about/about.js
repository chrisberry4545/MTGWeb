(function () {
    'use strict';
    var controllerId = 'about';
    angular.module('app').controller(controllerId, ['common', 'datacontext', about]);

    function about(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () {
                    trackEvent(controllerId, 'init');
                });
        }
    }
})();