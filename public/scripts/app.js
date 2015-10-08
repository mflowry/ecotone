var app=angular.module("ecotoneApp",["ngRoute","ngMaterial","ngMessages"]);app.config(["$mdThemingProvider","$routeProvider","$locationProvider","$httpProvider",function(e,t,r,o){r.html5Mode(!0),e.theme("default").primaryPalette("green").accentPalette("blue").warnPalette("orange"),t.when("/",{templateUrl:"/views/calculator.html",controller:"calcCtrl"}).when("/login",{templateUrl:"/views/login.html",controller:""}).when("/register",{templateUrl:"/views/register.html",controller:"createAccountCtrl"}).when("/account",{templateUrl:"/views/account.html",controller:""}).when("/dashboard",{templateUrl:"/views/dashboard.html",controller:""}).when("/projects",{templateUrl:"/views/project.html",controller:""}).when("/about",{templateUrl:"/views/about.html",controller:""}).when("/contact",{templateUrl:"/views/contact.html",controller:""}).when("/privacy",{templateUrl:"/views/privacy.html",controller:""}).otherwise({redirectTo:"/"})}]),app.controller("calcCtrl",["$scope","$http",function(e,t){e.major=["Category 1","Category 2","Category 3"],e.sub=["Sub-category 1","Sub-category 2","Sub-category 3"],e.unit=["lbs","tons","kg"]}]),app.controller("createAccountCtrl",["$scope","$http",function(e,t){e.user={},e.processForm=function(r){console.log("Posting..."),t({method:"POST",url:"/newUser",data:e.user,dataType:"json"}).then(function(e){console.log(e),alert("Your account has been created.")})}}]),app.service("authService",["$window",function(e){this.parseJwt=function(t){if(t){var r=t.split(".")[1],o=r.replace("-","+").replace("_","/");return JSON.parse(e.atob(o))}return{}},this.saveToken=function(t){e.localStorage.jwtToken=t,console.log("Saved token:",e.localStorage.jwtToken)},this.getToken=function(){return e.localStorage.jwtToken},this.isAuthed=function(){var e=this.getToken();if(e){var t=this.parseJwt(e),r=Math.round((new Date).getTime()/1e3)<=t.exp;return r||this.logout(),r}return!1},this.logout=function(){delete e.localStorage.jwtToken},this.getUser=function(){return this.parseJwt(this.getToken())}}]),app.factory("authInterceptor",["$q","$location","authService",function(e,t,r){return{request:function(e){return e.headers=e.headers||{},r.isAuthed()&&(e.headers.Authorization="Bearer "+r.getToken()),e},response:function(r){return 401===r.status&&t.path("/login"),r||e.when(r)},responseError:function(r){return 401===r.status?t.path("/login"):console.log(r),e.reject(r)}}}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdHMvYXBwLmpzIl0sIm5hbWVzIjpbImFwcCIsImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkbWRUaGVtaW5nUHJvdmlkZXIiLCIkcm91dGVQcm92aWRlciIsIiRsb2NhdGlvblByb3ZpZGVyIiwiJGh0dHBQcm92aWRlciIsImh0bWw1TW9kZSIsInRoZW1lIiwicHJpbWFyeVBhbGV0dGUiLCJhY2NlbnRQYWxldHRlIiwid2FyblBhbGV0dGUiLCJ3aGVuIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwicmVkaXJlY3RUbyIsIiRzY29wZSIsIiRodHRwIiwibWFqb3IiLCJzdWIiLCJ1bml0IiwidXNlciIsInByb2Nlc3NGb3JtIiwiY29uc29sZSIsImxvZyIsIm1ldGhvZCIsInVybCIsImRhdGEiLCJkYXRhVHlwZSIsInRoZW4iLCJyZXNwb25zZSIsImFsZXJ0Iiwic2VydmljZSIsIiR3aW5kb3ciLCJ0aGlzIiwicGFyc2VKd3QiLCJ0b2tlbiIsImJhc2U2NFVybCIsInNwbGl0IiwiYmFzZTY0IiwicmVwbGFjZSIsIkpTT04iLCJwYXJzZSIsImF0b2IiLCJzYXZlVG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJqd3RUb2tlbiIsImdldFRva2VuIiwiaXNBdXRoZWQiLCJwYXJhbXMiLCJub3RFeHBpcmVkIiwiTWF0aCIsInJvdW5kIiwiRGF0ZSIsImdldFRpbWUiLCJleHAiLCJsb2dvdXQiLCJnZXRVc2VyIiwiZmFjdG9yeSIsIiRxIiwiJGxvY2F0aW9uIiwiYXV0aFNlcnZpY2UiLCJyZXF1ZXN0IiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJzdGF0dXMiLCJwYXRoIiwicmVzcG9uc2VFcnJvciIsInJlamVjdCJdLCJtYXBwaW5ncyI6IkFBQUEsR0FBSUEsS0FBTUMsUUFBUUMsT0FBTyxjQUFlLFVBQVcsYUFBYyxjQUVqRUYsS0FBSUcsUUFBUSxxQkFBc0IsaUJBQWtCLG9CQUFxQixnQkFBaUIsU0FBU0MsRUFBb0JDLEVBQWdCQyxFQUFtQkMsR0FDdEpELEVBQWtCRSxXQUFVLEdBRTVCSixFQUFtQkssTUFBTSxXQUNwQkMsZUFBZSxTQUNmQyxjQUFjLFFBQ2RDLFlBQWEsVUFFbEJQLEVBQWVRLEtBQUssS0FFWkMsWUFBYSx5QkFDYkMsV0FBWSxhQUNiRixLQUFLLFVBRUpDLFlBQWEsb0JBQ2JDLFdBQVksS0FDYkYsS0FBSyxhQUVKQyxZQUFhLHVCQUNiQyxXQUFZLHNCQUNiRixLQUFLLFlBRUpDLFlBQWEsc0JBQ2JDLFdBQVksS0FDYkYsS0FBSyxjQUVKQyxZQUFhLHdCQUNiQyxXQUFZLEtBQ2JGLEtBQUssYUFFSkMsWUFBYSxzQkFDYkMsV0FBWSxLQUNiRixLQUFLLFVBRUpDLFlBQWEsb0JBQ2JDLFdBQVksS0FDYkYsS0FBSyxZQUVKQyxZQUFhLHNCQUNiQyxXQUFZLEtBQ2JGLEtBQUssWUFFSkMsWUFBYSxzQkFDYkMsV0FBWSxLQUNiQyxXQUNDQyxXQUFZLFNBTXhCakIsSUFBSWUsV0FBVyxZQUFhLFNBQVUsUUFBUyxTQUFTRyxFQUFRQyxHQUM1REQsRUFBT0UsT0FDSCxhQUNBLGFBQ0EsY0FFSkYsRUFBT0csS0FDSCxpQkFDQSxpQkFDQSxrQkFFSkgsRUFBT0ksTUFDSCxNQUNBLE9BQ0EsU0FJUnRCLElBQUllLFdBQVcscUJBQXNCLFNBQVUsUUFBUyxTQUFTRyxFQUFRQyxHQUNyRUQsRUFBT0ssUUFFUEwsRUFBT00sWUFBYyxTQUFVRCxHQUMzQkUsUUFBUUMsSUFBSSxjQUNaUCxHQUNJUSxPQUFRLE9BQ1JDLElBQUssV0FDTEMsS0FBTVgsRUFBT0ssS0FDYk8sU0FBVSxTQUNYQyxLQUFLLFNBQVVDLEdBQ2RQLFFBQVFDLElBQUlNLEdBQ1pDLE1BQU0sd0NBT2xCakMsSUFBSWtDLFFBQVEsZUFBZ0IsVUFBVyxTQUFVQyxHQUM3Q0MsS0FBS0MsU0FBVyxTQUFVQyxHQUN0QixHQUFJQSxFQUFPLENBQ1AsR0FBSUMsR0FBWUQsRUFBTUUsTUFBTSxLQUFLLEdBQzdCQyxFQUFTRixFQUFVRyxRQUFRLElBQUssS0FBS0EsUUFBUSxJQUFLLElBQ3RELE9BQU9DLE1BQUtDLE1BQU1ULEVBQVFVLEtBQUtKLElBQzVCLFVBR1hMLEtBQUtVLFVBQVksU0FBVVIsR0FDdkJILEVBQVFZLGFBQWFDLFNBQVdWLEVBQ2hDYixRQUFRQyxJQUFJLGVBQWVTLEVBQVFZLGFBQWFDLFdBR3BEWixLQUFLYSxTQUFXLFdBQ1osTUFBT2QsR0FBUVksYUFBYUMsVUFHaENaLEtBQUtjLFNBQVcsV0FDWixHQUFJWixHQUFRRixLQUFLYSxVQUNqQixJQUFJWCxFQUFPLENBQ1AsR0FBSWEsR0FBU2YsS0FBS0MsU0FBU0MsR0FDdkJjLEVBQWFDLEtBQUtDLE9BQU0sR0FBSUMsT0FBT0MsVUFBWSxNQUFTTCxFQUFPTSxHQUluRSxPQUhLTCxJQUNEaEIsS0FBS3NCLFNBRUZOLEVBRVAsT0FBTyxHQUlmaEIsS0FBS3NCLE9BQVMsaUJBQ0h2QixHQUFRWSxhQUFhQyxVQUloQ1osS0FBS3VCLFFBQVUsV0FDWCxNQUFPdkIsTUFBS0MsU0FBU0QsS0FBS2EsZ0JBSWxDakQsSUFBSTRELFFBQVEsbUJBQW9CLEtBQU0sWUFBYSxjQUFlLFNBQVVDLEVBQUlDLEVBQVdDLEdBQ3ZGLE9BQ0lDLFFBQVMsU0FBVTdELEdBS2YsTUFKQUEsR0FBTzhELFFBQVU5RCxFQUFPOEQsWUFDcEJGLEVBQVliLGFBQ1ovQyxFQUFPOEQsUUFBUUMsY0FBZ0IsVUFBWUgsRUFBWWQsWUFFcEQ5QyxHQUVYNkIsU0FBVSxTQUFVQSxHQU9oQixNQUx3QixPQUFwQkEsRUFBU21DLFFBR1RMLEVBQVVNLEtBQUssVUFFWnBDLEdBQVk2QixFQUFHaEQsS0FBS21CLElBQzVCcUMsY0FBZSxTQUFVckMsR0FPeEIsTUFOd0IsT0FBcEJBLEVBQVNtQyxPQUNUTCxFQUFVTSxLQUFLLFVBR2YzQyxRQUFRQyxJQUFJTSxHQUVUNkIsRUFBR1MsT0FBT3RDIiwiZmlsZSI6InNjcmlwdHMvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdlY290b25lQXBwJywgWyduZ1JvdXRlJywgJ25nTWF0ZXJpYWwnLCAnbmdNZXNzYWdlcyddKTtcblxuYXBwLmNvbmZpZyhbJyRtZFRoZW1pbmdQcm92aWRlcicsICckcm91dGVQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsICckaHR0cFByb3ZpZGVyJywgZnVuY3Rpb24oJG1kVGhlbWluZ1Byb3ZpZGVyLCAkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRodHRwUHJvdmlkZXIpe1xuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblxuICAgICRtZFRoZW1pbmdQcm92aWRlci50aGVtZSgnZGVmYXVsdCcpXG4gICAgICAgIC5wcmltYXJ5UGFsZXR0ZSgnZ3JlZW4nKVxuICAgICAgICAuYWNjZW50UGFsZXR0ZSgnYmx1ZScpXG4gICAgICAgIC53YXJuUGFsZXR0ZSAoJ29yYW5nZScpO1xuXG4gICAgJHJvdXRlUHJvdmlkZXIud2hlbignLycsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2NhbGN1bGF0b3IuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnY2FsY0N0cmwnXG4gICAgICAgIH0pLndoZW4oJy9sb2dpbicsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJydcbiAgICAgICAgfSkud2hlbignL3JlZ2lzdGVyJyxcbiAgICAgICAge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvcmVnaXN0ZXIuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnY3JlYXRlQWNjb3VudEN0cmwnXG4gICAgICAgIH0pLndoZW4oJy9hY2NvdW50JyxcbiAgICAgICAge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvYWNjb3VudC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICcnXG4gICAgICAgIH0pLndoZW4oJy9kYXNoYm9hcmQnLFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9kYXNoYm9hcmQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnJ1xuICAgICAgICB9KS53aGVuKCcvcHJvamVjdHMnLFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy9wcm9qZWN0Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJydcbiAgICAgICAgfSkud2hlbignL2Fib3V0JyxcbiAgICAgICAge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvYWJvdXQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnJ1xuICAgICAgICB9KS53aGVuKCcvY29udGFjdCcsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2NvbnRhY3QuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnJ1xuICAgICAgICB9KS53aGVuKCcvcHJpdmFjeScsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL3ByaXZhY3kuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnJ1xuICAgICAgICB9KS5vdGhlcndpc2Uoe1xuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXG4gICAgICAgIH0pO1xuXG4gICAgLy8kaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3InKTtcbn1dKTtcblxuYXBwLmNvbnRyb2xsZXIoJ2NhbGNDdHJsJywgWyckc2NvcGUnLCAnJGh0dHAnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwKXtcbiAgICAkc2NvcGUubWFqb3IgPSBbXG4gICAgICAgICdDYXRlZ29yeSAxJyxcbiAgICAgICAgJ0NhdGVnb3J5IDInLFxuICAgICAgICAnQ2F0ZWdvcnkgMydcbiAgICBdO1xuICAgICRzY29wZS5zdWIgPSBbXG4gICAgICAgICdTdWItY2F0ZWdvcnkgMScsXG4gICAgICAgICdTdWItY2F0ZWdvcnkgMicsXG4gICAgICAgICdTdWItY2F0ZWdvcnkgMydcbiAgICBdO1xuICAgICRzY29wZS51bml0ID0gW1xuICAgICAgICAnbGJzJyxcbiAgICAgICAgJ3RvbnMnLFxuICAgICAgICAna2cnXG4gICAgXTtcbn1dKTtcblxuYXBwLmNvbnRyb2xsZXIoJ2NyZWF0ZUFjY291bnRDdHJsJywgWyckc2NvcGUnLCAnJGh0dHAnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwKSB7XG4gICAgJHNjb3BlLnVzZXIgPSB7fTtcblxuICAgICRzY29wZS5wcm9jZXNzRm9ybSA9IGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUG9zdGluZy4uLlwiKTtcbiAgICAgICAgJGh0dHAoe1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvbmV3VXNlcicsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUudXNlcixcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIGFsZXJ0KFwiWW91ciBhY2NvdW50IGhhcyBiZWVuIGNyZWF0ZWQuXCIpXG4gICAgICAgIH0pXG4gICAgfTtcblxufV0pO1xuXG4vLyBTZXJ2aWNlcyBmb3IgYXV0aGVudGljYXRpb25cbmFwcC5zZXJ2aWNlKCdhdXRoU2VydmljZScsIFsnJHdpbmRvdycsIGZ1bmN0aW9uICgkd2luZG93KXtcbiAgICB0aGlzLnBhcnNlSnd0ID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgdmFyIGJhc2U2NFVybCA9IHRva2VuLnNwbGl0KCcuJylbMV07XG4gICAgICAgICAgICB2YXIgYmFzZTY0ID0gYmFzZTY0VXJsLnJlcGxhY2UoJy0nLCAnKycpLnJlcGxhY2UoJ18nLCAnLycpO1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoJHdpbmRvdy5hdG9iKGJhc2U2NCkpO1xuICAgICAgICB9IGVsc2UgcmV0dXJuIHt9O1xuICAgIH07XG5cbiAgICB0aGlzLnNhdmVUb2tlbiA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3RUb2tlbiA9IHRva2VuO1xuICAgICAgICBjb25zb2xlLmxvZygnU2F2ZWQgdG9rZW46Jywkd2luZG93LmxvY2FsU3RvcmFnZS5qd3RUb2tlbik7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0VG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3RUb2tlbjtcbiAgICB9O1xuXG4gICAgdGhpcy5pc0F1dGhlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRva2VuID0gdGhpcy5nZXRUb2tlbigpO1xuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB0aGlzLnBhcnNlSnd0KHRva2VuKTtcbiAgICAgICAgICAgIHZhciBub3RFeHBpcmVkID0gTWF0aC5yb3VuZChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApIDw9IHBhcmFtcy5leHA7XG4gICAgICAgICAgICBpZiAoIW5vdEV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ291dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vdEV4cGlyZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlbGV0ZSAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3RUb2tlbjtcbiAgICB9O1xuXG4gICAgLy8gZXhwb3NlIHVzZXIgYXMgYW4gb2JqZWN0XG4gICAgdGhpcy5nZXRVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUp3dCh0aGlzLmdldFRva2VuKCkpXG4gICAgfTtcbn1dKTtcblxuYXBwLmZhY3RvcnkoJ2F1dGhJbnRlcmNlcHRvcicsIFsnJHEnLCAnJGxvY2F0aW9uJywgJ2F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkbG9jYXRpb24sIGF1dGhTZXJ2aWNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVxdWVzdDogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcbiAgICAgICAgICAgIGlmIChhdXRoU2VydmljZS5pc0F1dGhlZCgpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIGF1dGhTZXJ2aWNlLmdldFRva2VuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgICAgICB9LFxuICAgICAgICByZXNwb25zZTogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuXG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZSB1c2VyIGlzIG5vdCBhdXRoZW50aWNhdGVkXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvbG9naW5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UgfHwgJHEud2hlbihyZXNwb25zZSk7XG4gICAgICAgIH0sIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvbG9naW5cIik7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICB9O1xufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==