(function () {
    'use strict';
    var controllerId = 'highpickreport';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'webapicontext', '$scope', highpickreport]);

    function highpickreport(common, datacontext, webapicontext, $scope) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.testButton = function () {
            webapicontext.setupFRFData();
        }

        activate();

        function activate() {
            $.when(webapicontext.getCardsSelected()).then(function (data) {
                $scope.$apply(function () {
                    vm.pickReport = data;
                });
            });
        }
    }
})();