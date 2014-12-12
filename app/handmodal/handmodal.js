(function () {
    'use strict';
    var controllerId = 'handmodal';
    angular.module('app').controller(controllerId, ['common', '$scope', 'handsimulator', '$modalInstance', 'fullDeck', handmodal]);

    function handmodal(common, $scope, handsimulator, $modalInstance, fullDeck) {

        var vm = this;

        vm.fullDeck = fullDeck;
        vm.currentCards = 7;

        $scope.generateNewHand = function () {
            vm.currentCards = 7;
            $scope.handCards = handsimulator.generateHand(vm.fullDeck, vm.currentCards);
        };
        $scope.handCards = handsimulator.generateHand(vm.fullDeck, vm.currentCards);


        $scope.mulligan = function () {
            if (vm.currentCards > 0) {
                vm.currentCards--;
            }
            $scope.handCards = handsimulator.generateHand(vm.fullDeck, vm.currentCards);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };


        activate();


        function activate() {
        }

    }
})();