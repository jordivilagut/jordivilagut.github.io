var portfolioApp = angular.module('portfolioApp', ["ngRoute", "duScroll"]);

portfolioApp.controller('portfolioController', function($scope){

    $scope.texts = textBodies;
    $scope.projects = projects;
    $scope.projectHeaders = projectHeaders;
    $scope.inquiryResult = inquiryResult;

    $scope.getEmailRegex = function() {
        var emailRegex = new RegExp(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
        return emailRegex;
    }

    $scope.changeProject = function(project) {
        $scope.project = project;
        $scope.technologies = projects[project].technologies;
    }

    $scope.scrollUp = function() {
        window.scrollTo(0, 0);
    }

    $scope.setUpForm = function() {
        $scope.inquiryProcess = "filling";
        $scope.inquiry = {};
    }

    $scope.validateForm = function() {
        var validation = true;
        $scope.val_email = "valid";
        $scope.val_description = "valid";
        $scope.val_name = "valid";
        var emailRegex = $scope.getEmailRegex();

        if (emailRegex.test($scope.inquiry.email) === false) {
            $scope.val_email = "invalid";
            validation = false;
        }

        if ($scope.inquiry.description === undefined || $scope.inquiry.description === "") {
            $scope.val_description = "invalid";
            validation = false;
        }

        if ($scope.inquiry.name === undefined || $scope.inquiry.name === "") {
            $scope.val_name = "invalid";
            validation = false;
        }

        return validation;
    }

    $scope.returnMessage = function(status) {
        console.log("ok!");
        $scope.inquiryStatus = status;
    }

    $scope.sendEmail = function() {
        event.preventDefault();

        var validForm = $scope.validateForm();

        if (validForm) {
            console.log("validform");
            $scope.inquiryProcess = "sending";
            $scope.inquiryStatus = "sending";

            emailjs.send("amazon_ses","rfq_mailservice",
                         {product: $scope.inquiry.product,
                          description: $scope.inquiry.description,
                          name: $scope.inquiry.name, 
                          email: $scope.inquiry.address,
                          phone: $scope.inquiry.phone
                         })
                .then(function(response) {
                $scope.$apply(function() {
                    $scope.returnMessage("success");
                });
                console.log("SUCCESS. status=%d, text=%s", response.status, response.text);

            }, function(err) {
                $scope.$apply(function() {
                    $scope.returnMessage("error");
                });
                console.log("FAILED. error=", err);
            });
        }
    }
});

portfolioApp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
        templateUrl : "main.htm"
    })
        .when("/projects", {
        templateUrl : "projects.htm"
    })
        .when("/pricing", {
        templateUrl : "pricing.htm"
    })
        .when("/sending", {
        templateUrl : "sending.htm"
    })
});