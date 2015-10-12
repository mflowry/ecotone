var app=angular.module("ecotoneApp",["ngRoute","ngMaterial","ngMessages"]);app.config(["$mdThemingProvider","$routeProvider","$locationProvider","$httpProvider",function(e,t,o,r){o.html5Mode(!0),e.theme("default").primaryPalette("green").accentPalette("blue-grey",{"default":"600"}).warnPalette("orange"),t.when("/",{templateUrl:"/views/calculator.html",controller:"calculateCtrl"}).when("/login",{templateUrl:"/views/login.html",controller:""}).when("/register",{templateUrl:"/views/register.html",controller:"createAccountCtrl"}).when("/account",{templateUrl:"/views/account.html",controller:""}).when("/dashboard",{templateUrl:"/views/dashboard.html",controller:"projectsCtrl"}).when("/projects",{templateUrl:"/views/project.html",controller:"projectsCtrl"}).when("/about",{templateUrl:"/views/about.html"}).when("/contact",{templateUrl:"/views/contact.html",controller:""}).when("/privacy",{templateUrl:"/views/privacy.html"}).otherwise({redirectTo:"/"})}]),app.controller("calculateCtrl",["$scope","$http",function(e,t){function o(e){var t=e.charAt(0).toUpperCase()+e.slice(1);return function(e){return-1!=e.primary_cat.indexOf(t)}}e.saveToProject=function(){var o={category:e.category,subcategory:e.subcategory,warm_Id:e.warmId,weight:parseFloat(e.weight)*e.conversion,units:e.unit.name};console.log(o),t.post("/addToProject").then(function(e){console.log(e)})},e.newCalculation=function(){console.log("Calculating...",e.weight);var o={warmId:e.warmId||e.category.secondaries[0].warm_id,weight:parseFloat(e.weight)*e.conversion};console.log(o),t.post("/calculations",o).then(function(t){e.result=Math.floor(1e3*Math.abs(t.data))/1e3,console.log(e.result)})},e.querySearch=function(t){return t?e.list.filter(o(t)):e.list},t.get("/materials").then(function(t){var o=t.data;o.forEach(function(e){e.primary_cat=e.primary_cat.charAt(0).toUpperCase()+e.primary_cat.slice(1).toLowerCase()}),e.list=o}),e.units=[{name:"lbs",conversion:5e-4},{name:"kilos",conversion:.00110231},{name:"tons",conversion:1},{name:"metric tons",conversion:1.10231}]}]),app.controller("loginCtrl",["$scope","$http","authService",function(e,t,o){e.login=function(){t({method:"POST",url:"/login",data:e.user}).then(function(e){o.saveToken(e.data.token)})}}]),app.controller("createAccountCtrl",["$scope","$http",function(e,t){e.user={},e.processForm=function(o){console.log("Posting..."),t({method:"POST",url:"/register",data:e.user,dataType:"json"}).then(function(e){console.log(e),alert("Your account has been created.")})}}]),app.controller("projectsCtrl",["$scope","$http",function(e,t){t({method:"POST",url:"http://www.w3schools.com/angular/customers.php"}).then(function(t){e.names=t.records})}]),app.service("authService",["$window",function(e){this.parseJwt=function(t){if(t){var o=t.split(".")[1],r=o.replace("-","+").replace("_","/");return JSON.parse(e.atob(r))}return{}},this.saveToken=function(t){e.localStorage.jwtToken=t,console.log("Saved token:",e.localStorage.jwtToken)},this.getToken=function(){return e.localStorage.jwtToken},this.isAuthed=function(){var e=this.getToken();if(e){var t=this.parseJwt(e),o=Math.round((new Date).getTime()/1e3)<=t.exp;return o||this.logout(),o}return!1},this.logout=function(){delete e.localStorage.jwtToken},this.getUser=function(){return this.parseJwt(this.getToken())}}]),app.factory("authInterceptor",["$q","$location","authService",function(e,t,o){return{request:function(e){return e.headers=e.headers||{},o.isAuthed()&&(e.headers.Authorization="Bearer "+o.getToken()),e},response:function(o){return 401===o.status&&t.path("/login"),o||e.when(o)},responseError:function(o){return 401===o.status?t.path("/login"):console.log(o),e.reject(o)}}}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdHMvYXBwLmpzIl0sIm5hbWVzIjpbImFwcCIsImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkbWRUaGVtaW5nUHJvdmlkZXIiLCIkcm91dGVQcm92aWRlciIsIiRsb2NhdGlvblByb3ZpZGVyIiwiJGh0dHBQcm92aWRlciIsImh0bWw1TW9kZSIsInRoZW1lIiwicHJpbWFyeVBhbGV0dGUiLCJhY2NlbnRQYWxldHRlIiwiZGVmYXVsdCIsIndhcm5QYWxldHRlIiwid2hlbiIsInRlbXBsYXRlVXJsIiwiY29udHJvbGxlciIsIm90aGVyd2lzZSIsInJlZGlyZWN0VG8iLCIkc2NvcGUiLCIkaHR0cCIsImNyZWF0ZUZpbHRlckZvciIsInF1ZXJ5IiwibG93ZXJjYXNlUXVlcnkiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwib2JqIiwicHJpbWFyeV9jYXQiLCJpbmRleE9mIiwic2F2ZVRvUHJvamVjdCIsImxpbmVJdGVtIiwiY2F0ZWdvcnkiLCJzdWJjYXRlZ29yeSIsIndhcm1fSWQiLCJ3YXJtSWQiLCJ3ZWlnaHQiLCJwYXJzZUZsb2F0IiwiY29udmVyc2lvbiIsInVuaXRzIiwidW5pdCIsIm5hbWUiLCJjb25zb2xlIiwibG9nIiwicG9zdCIsInRoZW4iLCJyZXNwb25zZSIsIm5ld0NhbGN1bGF0aW9uIiwiY2FsY3VsYXRlIiwic2Vjb25kYXJpZXMiLCJ3YXJtX2lkIiwicmVzdWx0IiwiTWF0aCIsImZsb29yIiwiYWJzIiwiZGF0YSIsInF1ZXJ5U2VhcmNoIiwibGlzdCIsImZpbHRlciIsImdldCIsImZvckVhY2giLCJpdGVtIiwidG9Mb3dlckNhc2UiLCJhdXRoU2VydmljZSIsImxvZ2luIiwibWV0aG9kIiwidXJsIiwidXNlciIsInNhdmVUb2tlbiIsInRva2VuIiwicHJvY2Vzc0Zvcm0iLCJkYXRhVHlwZSIsImFsZXJ0IiwibmFtZXMiLCJyZWNvcmRzIiwic2VydmljZSIsIiR3aW5kb3ciLCJ0aGlzIiwicGFyc2VKd3QiLCJiYXNlNjRVcmwiLCJzcGxpdCIsImJhc2U2NCIsInJlcGxhY2UiLCJKU09OIiwicGFyc2UiLCJhdG9iIiwibG9jYWxTdG9yYWdlIiwiand0VG9rZW4iLCJnZXRUb2tlbiIsImlzQXV0aGVkIiwicGFyYW1zIiwibm90RXhwaXJlZCIsInJvdW5kIiwiRGF0ZSIsImdldFRpbWUiLCJleHAiLCJsb2dvdXQiLCJnZXRVc2VyIiwiZmFjdG9yeSIsIiRxIiwiJGxvY2F0aW9uIiwicmVxdWVzdCIsImhlYWRlcnMiLCJBdXRob3JpemF0aW9uIiwic3RhdHVzIiwicGF0aCIsInJlc3BvbnNlRXJyb3IiLCJyZWplY3QiXSwibWFwcGluZ3MiOiJBQUFBLEdBQUlBLEtBQU1DLFFBQVFDLE9BQU8sY0FBZSxVQUFXLGFBQWMsY0FFakVGLEtBQUlHLFFBQVEscUJBQXNCLGlCQUFrQixvQkFBcUIsZ0JBQWlCLFNBQVNDLEVBQW9CQyxFQUFnQkMsRUFBbUJDLEdBQ3RKRCxFQUFrQkUsV0FBVSxHQUc1QkosRUFBbUJLLE1BQU0sV0FDcEJDLGVBQWUsU0FDZkMsY0FBYyxhQUFjQyxVQUFVLFFBQ3RDQyxZQUFhLFVBR2xCUixFQUFlUyxLQUFLLEtBRVpDLFlBQWEseUJBQ2JDLFdBQVksa0JBQ2JGLEtBQUssVUFFSkMsWUFBYSxvQkFDYkMsV0FBWSxLQUNiRixLQUFLLGFBRUpDLFlBQWEsdUJBQ2JDLFdBQVksc0JBQ2JGLEtBQUssWUFFSkMsWUFBYSxzQkFDYkMsV0FBWSxLQUNiRixLQUFLLGNBRUpDLFlBQWEsd0JBQ2JDLFdBQVksaUJBQ2JGLEtBQUssYUFFSkMsWUFBYSxzQkFDYkMsV0FBWSxpQkFDYkYsS0FBSyxVQUVKQyxZQUFhLHNCQUNkRCxLQUFLLFlBRUpDLFlBQWEsc0JBQ2JDLFdBQVksS0FDYkYsS0FBSyxZQUVKQyxZQUFhLHdCQUNkRSxXQUNDQyxXQUFZLFNBT3hCbEIsSUFBSWdCLFdBQVcsaUJBQWtCLFNBQVUsUUFBUyxTQUFTRyxFQUFRQyxHQTBFakUsUUFBU0MsR0FBZ0JDLEdBQ3JCLEdBQUlDLEdBQWlCRCxFQUFNRSxP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UVUsYUFBYUMsV0FHcERWLEtBQUtXLFNBQVcsV0FDWixNQUFPWixHQUFRVSxhQUFhQyxVQUdoQ1YsS0FBS1ksU0FBVyxXQUNaLEdBQUlwQixHQUFRUSxLQUFLVyxVQUNqQixJQUFJbkIsRUFBTyxDQUNQLEdBQUlxQixHQUFTYixLQUFLQyxTQUFTVCxHQUN2QnNCLEVBQWF2QyxLQUFLd0MsT0FBTSxHQUFJQyxPQUFPQyxVQUFZLE1BQVNKLEVBQU9LLEdBSW5FLE9BSEtKLElBQ0RkLEtBQUttQixTQUVGTCxFQUVQLE9BQU8sR0FJZmQsS0FBS21CLE9BQVMsaUJBQ0hwQixHQUFRVSxhQUFhQyxVQUloQ1YsS0FBS29CLFFBQVUsV0FDWCxNQUFPcEIsTUFBS0MsU0FBU0QsS0FBS1csZ0JBSWxDeEYsSUFBSWtHLFFBQVEsbUJBQW9CLEtBQU0sWUFBYSxjQUFlLFNBQVVDLEVBQUlDLEVBQVdyQyxHQUN2RixPQUNJc0MsUUFBUyxTQUFVbEcsR0FLZixNQUpBQSxHQUFPbUcsUUFBVW5HLEVBQU9tRyxZQUNwQnZDLEVBQVkwQixhQUNadEYsRUFBT21HLFFBQVFDLGNBQWdCLFVBQVl4QyxFQUFZeUIsWUFFcERyRixHQUVYMkMsU0FBVSxTQUFVQSxHQU9oQixNQUx3QixPQUFwQkEsRUFBUzBELFFBR1RKLEVBQVVLLEtBQUssVUFFWjNELEdBQVlxRCxFQUFHckYsS0FBS2dDLElBQzVCNEQsY0FBZSxTQUFVNUQsR0FPeEIsTUFOd0IsT0FBcEJBLEVBQVMwRCxPQUNUSixFQUFVSyxLQUFLLFVBR2YvRCxRQUFRQyxJQUFJRyxHQUVUcUQsRUFBR1EsT0FBTzdEIiwiZmlsZSI6InNjcmlwdHMvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdlY290b25lQXBwJywgWyduZ1JvdXRlJywgJ25nTWF0ZXJpYWwnLCAnbmdNZXNzYWdlcyddKTtcblxuYXBwLmNvbmZpZyhbJyRtZFRoZW1pbmdQcm92aWRlcicsICckcm91dGVQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsICckaHR0cFByb3ZpZGVyJywgZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyLCAkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRodHRwUHJvdmlkZXIpe1xuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblxuICAgIC8vc2V0IHRoZW1lIGFuZCBjb2xvciBwYWxldHRlXG4gICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcbiAgICAgICAgLnByaW1hcnlQYWxldHRlKCdncmVlbicpXG4gICAgICAgIC5hY2NlbnRQYWxldHRlKCdibHVlLWdyZXknLCB7J2RlZmF1bHQnOic2MDAnfSlcbiAgICAgICAgLndhcm5QYWxldHRlICgnb3JhbmdlJyk7XG5cbiAgICAvL3JvdXRlcyBmb3Igdmlld3NcbiAgICAkcm91dGVQcm92aWRlci53aGVuKCcvJyxcbiAgICAgICAge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvY2FsY3VsYXRvci5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjYWxjdWxhdGVDdHJsJ1xuICAgICAgICB9KS53aGVuKCcvbG9naW4nLFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICcnXG4gICAgICAgIH0pLndoZW4oJy9yZWdpc3RlcicsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL3JlZ2lzdGVyLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ2NyZWF0ZUFjY291bnRDdHJsJ1xuICAgICAgICB9KS53aGVuKCcvYWNjb3VudCcsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2FjY291bnQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnJ1xuICAgICAgICB9KS53aGVuKCcvZGFzaGJvYXJkJyxcbiAgICAgICAge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvZGFzaGJvYXJkLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ3Byb2plY3RzQ3RybCdcbiAgICAgICAgfSkud2hlbignL3Byb2plY3RzJyxcbiAgICAgICAge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvcHJvamVjdC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwcm9qZWN0c0N0cmwnXG4gICAgICAgIH0pLndoZW4oJy9hYm91dCcsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2Fib3V0Lmh0bWwnXG4gICAgICAgIH0pLndoZW4oJy9jb250YWN0JyxcbiAgICAgICAge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvY29udGFjdC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICcnXG4gICAgICAgIH0pLndoZW4oJy9wcml2YWN5JyxcbiAgICAgICAge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvcHJpdmFjeS5odG1sJ1xuICAgICAgICB9KS5vdGhlcndpc2Uoe1xuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXG4gICAgICAgIH0pO1xuXG4gICAgLy8kaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3InKTtcbn1dKTtcblxuICAgIC8vTS8vZGVzaWduYXRlIGNvbnRyb2xsZXJcbmFwcC5jb250cm9sbGVyKCdjYWxjdWxhdGVDdHJsJywgWyckc2NvcGUnLCAnJGh0dHAnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwKSB7XG4vLyBjcmVhdGUgb2JqZWN0IHRvIHNlbmQgdG8gYmFja2VuZCBmb3IgY2FsY3VsYXRpb25cblxuICAgICRzY29wZS5zYXZlVG9Qcm9qZWN0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGxpbmVJdGVtID0ge1xuICAgICAgICAgICAgY2F0ZWdvcnk6ICRzY29wZS5jYXRlZ29yeSxcbiAgICAgICAgICAgIHN1YmNhdGVnb3J5OiAkc2NvcGUuc3ViY2F0ZWdvcnksXG4gICAgICAgICAgICB3YXJtX0lkOiAkc2NvcGUud2FybUlkLFxuICAgICAgICAgICAgd2VpZ2h0OiBwYXJzZUZsb2F0KCRzY29wZS53ZWlnaHQpKiRzY29wZS5jb252ZXJzaW9uLFxuICAgICAgICAgICAgdW5pdHM6ICRzY29wZS51bml0Lm5hbWVcbiAgICAgICAgfTtcbiAgICAgICAgY29uc29sZS5sb2cobGluZUl0ZW0pO1xuICAgICAgICAkaHR0cC5wb3N0KCcvYWRkVG9Qcm9qZWN0JykudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAkc2NvcGUubmV3Q2FsY3VsYXRpb24gPSBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNhbGN1bGF0aW5nLi4uXCIsICRzY29wZS53ZWlnaHQpO1xuICAgICAgICB2YXIgY2FsY3VsYXRlID0ge1xuICAgICAgICAgICAgd2FybUlkOiAkc2NvcGUud2FybUlkIHx8ICRzY29wZS5jYXRlZ29yeS5zZWNvbmRhcmllc1swXS53YXJtX2lkLFxuICAgICAgICAgICAgd2VpZ2h0OiBwYXJzZUZsb2F0KCRzY29wZS53ZWlnaHQpKiRzY29wZS5jb252ZXJzaW9uXG4gICAgICAgIH07XG4gICAgICAgIGNvbnNvbGUubG9nKGNhbGN1bGF0ZSk7XG4gICAgICAgICRodHRwLnBvc3QoJy9jYWxjdWxhdGlvbnMnLCBjYWxjdWxhdGUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5yZXN1bHQgPSBNYXRoLmZsb29yKE1hdGguYWJzKHJlc3BvbnNlLmRhdGEpICogMTAwMCkgLyAxMDAwO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnJlc3VsdCk7XG5cbiAgICAgICAgfSk7XG4gICAgfTtcblxuLy9hdXRvY29tcGxldGUgZnVuY3Rpb25hbGl0eVxuICAgICRzY29wZS5xdWVyeVNlYXJjaD1mdW5jdGlvbihxdWVyeSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUubGlzdC5maWx0ZXIoY3JlYXRlRmlsdGVyRm9yKHF1ZXJ5KSkpO1xuICAgICAgICByZXR1cm4gcXVlcnkgPyAkc2NvcGUubGlzdC5maWx0ZXIoY3JlYXRlRmlsdGVyRm9yKHF1ZXJ5KSkgOiAkc2NvcGUubGlzdDtcbiAgICB9O1xuXG4vL2xvYWQgUHJpbWFyeSBjYXRlZ29yaWVzIGxpc3Qgb24gcGFnZSBsb2FkXG4gICAgJGh0dHAuZ2V0KCcvbWF0ZXJpYWxzJykudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICB2YXIgbGlzdCA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgLy9pdGVtLnByaW1hcnlfY2F0ID0gaXRlbS5wcmltYXJ5X2NhdC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICAvLyBjYXVzaW5nIGJ1Z3MgcmlnaHQgbm93XG4gICAgICAgICAgICBpdGVtLnByaW1hcnlfY2F0ID0gaXRlbS5wcmltYXJ5X2NhdC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGl0ZW0ucHJpbWFyeV9jYXQuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgJHNjb3BlLmxpc3QgPSBsaXN0O1xuXG4gICAgfSk7XG5cbi8vbG9hZCB0aGUgdW5pdHNcbiAgICAkc2NvcGUudW5pdHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsYnMnLFxuICAgICAgICAgICAgY29udmVyc2lvbjogMC4wMDA1XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdraWxvcycsXG4gICAgICAgICAgICBjb252ZXJzaW9uOiAwLjAwMTEwMjMxXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd0b25zJyxcbiAgICAgICAgICAgIGNvbnZlcnNpb246IDFcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ21ldHJpYyB0b25zJyxcbiAgICAgICAgICAgIGNvbnZlcnNpb246IDEuMTAyMzFcbiAgICAgICAgfVxuICAgIF07XG4vL1xuXG4vL0NyZWF0ZSBmaWx0ZXIgZnVuY3Rpb24gZm9yIGEgcXVlcnkgc3RyaW5nXG4gICAgZnVuY3Rpb24gY3JlYXRlRmlsdGVyRm9yKHF1ZXJ5KSB7XG4gICAgICAgIHZhciBsb3dlcmNhc2VRdWVyeSA9IHF1ZXJ5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcXVlcnkuc2xpY2UoMSk7XG4gICAgICAgIC8vY29uc29sZS5sb2cocXVlcnkpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gZmlsdGVyRm4ob2JqKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKG9iai5wcmltYXJ5X2NhdCk7XG4gICAgICAgICAgICByZXR1cm4gKG9iai5wcmltYXJ5X2NhdC5pbmRleE9mKGxvd2VyY2FzZVF1ZXJ5KSAhPSAtMSk7XG4gICAgICAgIH07XG4gICAgfVxufV0pO1xuXG5cbi8vIExvZ2luIEhUTUwgLSBLYXRlXG5hcHAuY29udHJvbGxlcignbG9naW5DdHJsJywgWyckc2NvcGUnLCAnJGh0dHAnLCAnYXV0aFNlcnZpY2UnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCBhdXRoU2VydmljZSkge1xuICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGh0dHAoe1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICAgICAgZGF0YTogJHNjb3BlLnVzZXJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICBhdXRoU2VydmljZS5zYXZlVG9rZW4ocmVzcG9uc2UuZGF0YS50b2tlbik7XG4gICAgICAgIH0pXG4gICAgfVxufV0pO1xuXG4vLyBSZWdpc3RlciBIVE1MIC0gTWFkZWxpbmVcbmFwcC5jb250cm9sbGVyKCdjcmVhdGVBY2NvdW50Q3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCkge1xuICAgICRzY29wZS51c2VyID0ge307XG5cbiAgICAkc2NvcGUucHJvY2Vzc0Zvcm0gPSBmdW5jdGlvbiAodXNlcikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBvc3RpbmcuLi5cIik7XG4gICAgICAgICRodHRwKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS51c2VyLFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgYWxlcnQoXCJZb3VyIGFjY291bnQgaGFzIGJlZW4gY3JlYXRlZC5cIilcbiAgICAgICAgfSlcbiAgICB9O1xufV0pO1xuXG4vLyBQcm9qZWN0IEhUTUwgLSBEYXNoYm9hcmQgSFRNTCAtIEtpbVxuYXBwLmNvbnRyb2xsZXIoJ3Byb2plY3RzQ3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCkge1xuICAgICRodHRwKHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHVybDogJ2h0dHA6Ly93d3cudzNzY2hvb2xzLmNvbS9hbmd1bGFyL2N1c3RvbWVycy5waHAnXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLm5hbWVzID0gcmVzcG9uc2UucmVjb3JkcztcbiAgICB9KTtcblxuXG59XSk7XG5cbi8vIFNlcnZpY2VzIGZvciBhdXRoZW50aWNhdGlvblxuYXBwLnNlcnZpY2UoJ2F1dGhTZXJ2aWNlJywgWyckd2luZG93JywgZnVuY3Rpb24gKCR3aW5kb3cpe1xuICAgIHRoaXMucGFyc2VKd3QgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICB2YXIgYmFzZTY0VXJsID0gdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgICAgIHZhciBiYXNlNjQgPSBiYXNlNjRVcmwucmVwbGFjZSgnLScsICcrJykucmVwbGFjZSgnXycsICcvJyk7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmF0b2IoYmFzZTY0KSk7XG4gICAgICAgIH0gZWxzZSByZXR1cm4ge307XG4gICAgfTtcblxuICAgIHRoaXMuc2F2ZVRva2VuID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dFRva2VuID0gdG9rZW47XG4gICAgICAgIGNvbnNvbGUubG9nKCdTYXZlZCB0b2tlbjonLCR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dFRva2VuKTtcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dFRva2VuO1xuICAgIH07XG5cbiAgICB0aGlzLmlzQXV0aGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLmdldFRva2VuKCk7XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHRoaXMucGFyc2VKd3QodG9rZW4pO1xuICAgICAgICAgICAgdmFyIG5vdEV4cGlyZWQgPSBNYXRoLnJvdW5kKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkgPD0gcGFyYW1zLmV4cDtcbiAgICAgICAgICAgIGlmICghbm90RXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nb3V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm90RXhwaXJlZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dFRva2VuO1xuICAgIH07XG5cbiAgICAvLyBleHBvc2UgdXNlciBhcyBhbiBvYmplY3RcbiAgICB0aGlzLmdldFVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlSnd0KHRoaXMuZ2V0VG9rZW4oKSlcbiAgICB9O1xufV0pO1xuXG5hcHAuZmFjdG9yeSgnYXV0aEludGVyY2VwdG9yJywgWyckcScsICckbG9jYXRpb24nLCAnYXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJHEsICRsb2NhdGlvbiwgYXV0aFNlcnZpY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuICAgICAgICAgICAgaWYgKGF1dGhTZXJ2aWNlLmlzQXV0aGVkKCkpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc3BvbnNlOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgdGhlIHVzZXIgaXMgbm90IGF1dGhlbnRpY2F0ZWRcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9sb2dpblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZSB8fCAkcS53aGVuKHJlc3BvbnNlKTtcbiAgICAgICAgfSwgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9sb2dpblwiKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgIH07XG59XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
