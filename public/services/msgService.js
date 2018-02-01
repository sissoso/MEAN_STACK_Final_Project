

app.factory('msgService' , function ($http) {


   return{

      addMsg: function (msgToAdd) {
          console.log(msgToAdd);
          $http.post('/loadMessagesId',msgToAdd).success(function (response) {
              console.log(msgToAdd);

          });

      },
       removeMsg: function (id) {
           console.log(id);
           $http.delete('/loadMessagesId/' + id).success(function (response) {
               console.log(response);
           });


       },
       editMsg: function (id) {
           console.log(id);
           $http.get('/loadMessagesId/' + id).success(function (response) {
               console.log("scope at service "+response);

               return response;


           });


       },
       updateMsg:function(id,x){
           $http.put('/loadMessagesId/' + id , x).success(function(response)
           {

           });
       }


   } ;
});