(function () {
    'use strict';

    var serviceId = 'webapicontext';
    angular.module('app').factory(serviceId,
        ['common', webapicontext]);

    function webapicontext(common) {
        var $q = common.$q;
        //var hostUrl = "http://localhost:57224";
        var hostUrl = "http://mtgmirror.com";
        var testWebApi = "/api/test";
        var gameWebApi = "/api/game";
        var startGameWebApi = "/api/startgame";
        var playerWebApi = "/api/player";
        var gameInfoWebApi = "/api/gameinfo";
        var joinGameWebApi = "/api/joingame";
        var leaveGameWebApi = "/api/leavegame";
        var pingGameWebApi = "/api/pinggame";
        var resultsGameWebApi = "/api/results";
        var nameChageWebApi = "/api/namechange";
        var removePlayerWebApi = "/api/removeplayer";
        var chatWebApi = "/api/chat";


        function getPlayerID() {
            var url = hostUrl + playerWebApi;
            return $.ajax({
                url: url
            }).done(function (data) {
                return data;
            });
        }

        function getListOfGames() {
            var url = hostUrl + gameInfoWebApi;
            return $.ajax({
                url: url,
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                dataType: "json"
            }).done(function (data) {
                return data;
            });
        }

        function getGameInfo(playerID) {
            var url = hostUrl + gameInfoWebApi;
            return $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(playerID),
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                dataType: "json"
            }).done(function (data) {
                return data;
            });
        }

        function changeName(playerID, name) {
            var url = hostUrl + nameChageWebApi;
            var dataToSend = {
                PlayerID: playerID,
                PlayerName: name
            }
            return $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(dataToSend),
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                dataType: "json"
            }).done(function (data) {
                return data;
            });
        }

        function createGame(playerID, boosters, name) {
            var url = hostUrl + gameWebApi;

            if (name.length > 50)
            {
                name = name.substring(0, 50);
            }

            var dataToSend = {
                PlayerID: playerID,
                BoostersToOpen: boosters,
                PlayerName: name
            }
            return $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(dataToSend),
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                return data;
            });
        }

        function startGame(playerID) {
            var url = hostUrl + startGameWebApi;
            return $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(playerID),
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                return data;
            });
        }

        function joinGame(playerID, gameID, name) {
            var url = hostUrl + joinGameWebApi;
            var dataToSend = {
                PlayerID: playerID,
                GameID: gameID,
                PlayerName: name
            };
            return $.ajax({
                url: url,
                data: JSON.stringify(dataToSend),
                type: "POST",
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                return data;
            });
        }

        function leaveGame(playerID) {
            var url = hostUrl + leaveGameWebApi;
            return $.ajax({
                url: url,
                data: JSON.stringify(playerID),
                type: "POST",
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                return data;
            });
        }

        function addCard(playerID, cardNumber) {
            var url = hostUrl + playerWebApi;
            var moveInfo =
                {
                    PlayerID: playerID,
                    CardNumber: cardNumber
                };
            return $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(moveInfo),
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                return data;
            });

        }

        function pingServer(playerID) {
            var url = hostUrl + pingGameWebApi;
            return $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(playerID),
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        }

        function getFinalGameResults(playerID) {
            var url = hostUrl + resultsGameWebApi;
            return $.ajax({
                url: url,
                data: JSON.stringify(playerID),
                type: "POST",
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                return data;
            });
        }

        function removePlayer(playerID, playerIndex) {
            var url = hostUrl + removePlayerWebApi;
            var moveInfo =
                {
                    PlayerID: playerID,
                    PlayerIndex: playerIndex
                };
            return $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(moveInfo),
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                return data;
            });
        }

        function postMessage(message, name) {
            var url = hostUrl + chatWebApi;
            var chatInputs =
                {
                    Name: name,
                    Text: message
                };
            return $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(chatInputs),
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                return data;
            });
        }

        var service = {
            getListOfGames: getListOfGames,
            getPlayerID: getPlayerID,
            createGame: createGame,
            joinGame: joinGame,
            getGameInfo: getGameInfo,
            leaveGame: leaveGame,
            pingServer: pingServer,
            addCard: addCard,
            startGame: startGame,
            getFinalGameResults: getFinalGameResults,
            changeName: changeName,
            removePlayer: removePlayer,
            postMessage: postMessage
        };



        return service;
    }
})();