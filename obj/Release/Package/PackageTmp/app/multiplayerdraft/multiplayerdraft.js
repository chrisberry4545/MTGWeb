
(function () {
    'use strict';
    var controllerId = 'multiplayerdraft';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'webapicontext', multiplayerdraft]);

    function multiplayerdraft(common, datacontext, webapicontext) {
        /*Parts to keep*/ 
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');

        var vm = this;
        vm.title = 'Multiplayer Draft';
        vm.tabNumber = 0;
        vm.pingTime = 2500;

        vm.playersInGame = [];
        vm.gameData;

        vm.allCards = [];

        vm.boosters_to_open = [1, 1, 1];

        vm.name = null;
        vm.unsetName = "";
        vm.timeRemaining = 0;
        

        vm.disableChat = false;
        vm.joinedGameState = 0;
        vm.gameStartedState = 1;
        vm.postGameState = 2;
        vm.notJoinedGameState = 3;
        vm.createdGameState = 4;
        vm.gameState = vm.notJoinedGameState;
        vm.loading = true;
        vm.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#C0C0C0'
        };

        vm.chatMessage = "";
        vm.chatbox = "";

        vm.createGame = function () {
            logSuccess("Creating game..");
            if (vm.name == null) {
                vm.name = "";
            }
            if (vm.gameState != vm.createdGameState)
            {
                vm.loading = true;
                $.when(webapicontext.createGame(vm.name)).then(function (data) {
                    if (data != null) {
                        vm.gameState = vm.createdGameState;
                        vm.gameData = data;
                        vm.loading = false;
                        common.$apply();
                    }
                });
            }
        };

        vm.joinGame = function (gameID) {
            logSuccess("Joining game..");
            vm.loading = true;
            $.when(webapicontext.joinGame(gameID, vm.name)).then(function (data) {
                if (data != null) {
                    vm.gameState = vm.joinedGameState;
                    vm.gameData = data;
                    vm.loading = false;
                    common.$apply();
                } else { log("This game has already started. Please try another.");}
            });
        };

        function resetGameVariables() {
            vm.gameState = vm.notJoinedGameState;
            vm.gameData = null;
            common.$apply();
        }

        vm.leaveGame = function () {
            vm.loading = true;
            $.when(webapicontext.leaveGame()).then(function (data) {
                vm.loading = false;
                resetGameVariables();
            })
        }

        vm.refreshGameInfo = function () {
            vm.loading = true;
            $.when(webapicontext.getGameInfo()).then(function (data) {

                if (data != null)
                {
                    vm.gameData = data;
                    if (vm.gameData.GameState == vm.gameStartedState) {
                        vm.startDraft();
                    }
                    if (data.Chat != null) {
                        fillChatBox(data.Chat);
                    }
                    if (vm.gameData.PlayerName != null) {
                        vm.name = vm.gameData.PlayerName;
                    }
                    vm.loading = false;
                    common.$apply();
                }
                else
                {
                    if (vm.gameState == vm.gameStartedState) {
                        log("You've been inactive for too long and have been removed from the game.");
                    } else {
                        log("You've been removed from the game.");
                    }
                    resetGameVariables();
                }
            });
        }

        vm.getGamesList = function () {
            vm.loading = true;
            $.when(webapicontext.getListOfGames()).then(function (data) {
                vm.avaliableGames = data.Games;
                if (data.Chat != null) {
                    fillChatBox(data.Chat);
                }
                vm.loading = false;
                common.$apply();
            });
        }

        function worker() {
            setTimeout(worker, vm.pingTime);

            if (vm.gameState == vm.joinedGameState || vm.gameState == vm.createdGameState) {
                vm.refreshGameInfo();
            }
            else if (vm.gameState == vm.gameStartedState) {
                vm.startDraft();
            }
            else {
                vm.getGamesList();
            }
        };

        //Starts a countdown.
        //var timer = setInterval(function () {
        //    if (vm.timeRemaining > 0) {
        //        vm.timeRemaining--;
        //        common.$apply();
        //    }
        //}, 1000);

        vm.postMessage = function () {
            if (vm.name == null || vm.name == "") {
                log("Please enter a name before posting a message.");
            }
            else
            {
                var chatMessage = vm.chatMessage;
                vm.chatMessage = "";
                vm.chatbox += formChatBoxMessage(vm.name, chatMessage);
                webapicontext.postMessage(chatMessage, vm.name);
            }
        }

        function fillChatBox(chatData) {
            var fullText = "";
            $.each(chatData, function (index, value) {
                fullText += formChatBoxMessage(value.PlayerName, value.Message);
            });
            vm.chatbox = fullText;
        }

        function formChatBoxMessage(playerName, message) {
            var fullText = playerName + ": " + message + "\n";
            return fullText;
        }

        vm.addCard = function (cardNumber) {
            if (!vm.gameData.Player.HadTurn) {
                log("Card picked..");
                vm.loading = true;
                $.when(webapicontext.addCard(cardNumber)).then(function (data) {
                    if (data != null) {
                        vm.gameData = data;
                        if (vm.gameData.GameState == vm.postGameState) {
                            //If game finished get final stats of game.
                            getGameStats();
                        }
                    }
                    vm.loading = false;
                    common.$apply();
                });
            }
            else {
                log("You've already chosen a card this round.");
            }
        };

        vm.backToLobby = function () {
            resetGameVariables();
        }

        function getGameStats() {
            $.when(webapicontext.getFinalGameResults()).then(function (data) {
                vm.gameData = data;
                vm.gameState = vm.postGameState;
                common.$apply();
            });
        }
        
        vm.startDraft = function () {
            var totalBooster = 0;
            $.each(vm.boosters_to_open, function (index, value) {
                totalBooster += parseInt(value,10);
            });
            if (totalBooster != 3) {
                log("You need 3 total boosters to start a game.");
            } else
            {
                if (vm.gameState != vm.gameStartedState) {
                    logSuccess("Starting draft..");
                    vm.loading = true;
                }
                $.when(webapicontext.startGame(vm.boosters_to_open)).then(function (data) {
                    if (data != null) {
                        if (data.RoundTime - 2 > 0) {
                            vm.timeRemaining = data.RoundTime - 2;
                        }
                        vm.gameState = vm.gameStartedState;
                        vm.gameData = data;
                        vm.loading = false;
                        common.$apply();
                    }
                    else {
                        log("You've been inactive for too long and have been removed from the game.");
                        resetGameVariables();
                    }
                });
            }
            
        };

        activate();

        function activate() {
            vm.getGamesList();
            var set3Cards = datacontext.getAllSet3CardsNoDelay().splice(0);
            var set1Cards = datacontext.getAllSet1CardsNoDelay().splice(0);
            var set2Cards = datacontext.getAllSet2CardsNoDelay().splice(0);

            vm.allCards = $.merge(set2Cards, set1Cards);
            vm.allCards = $.merge(vm.allCards, set3Cards);
            common.activateController([setupPlayerID()], controllerId)
                .then(function () {
                    worker();
                    vm.loading = false;
                });
        };

        function setupPlayerID() {
            $.when(webapicontext.getPlayerID()).then(function (data) {
                if (data != null) {
                    assignCorrectGameData(data);
                    common.$apply();
                }
            });
        }

        function assignCorrectGameData(data) {
            switch (data.GameState) {
                case vm.notJoinedGameState:
                    //Do nothing
                    break;
                case vm.joinedGameState:
                    vm.gameData = data;
                    vm.gameState = vm.joinedGameState;
                    break;
                case vm.createdGameState:
                    vm.gameData = data;
                    vm.gameState = vm.createdGameState;
                    break;
                case vm.gameStartedState:
                    vm.gameData = data;
                    vm.gameState = vm.gameStartedState;
                    break
                case vm.postGameState:
                    vm.gameData = data;
                    vm.gameState = vm.postGameState;
                    break;
                default:
                    log("No appropriate game data found.");
            }
        }

        vm.removePlayer = function (index) {
            log("Attempting to remove player..");
            vm.loading = true;
            $.when(webapicontext.removePlayer(index)).then(function (data) {
                log("Player successfully removed.");
                vm.loading = false;
            });
        }

        vm.setName = function () {
            if (vm.unsetName != "") {
                vm.name = vm.unsetName;
                log("Name set to: " + vm.name);
            }
            else {
                log("Please enter a name.");
            }
        }
    }
})();