# Installation

Since this is just a demo app, I'll include the keys with this repo here rather than follow best practices

1. Prerequisites: `yarn`, `node v10`, `docker`
2. All instructions should be done relative to the project root
3. For starters, go to the project dir and copy `.env.example` to `.env`
4. Copy the `serviceAccountKey.json` in this folder to `<project>/src/settings/credentials/`
5. Make sure you have node v10 and the latest yarn installed.
6. Run `yarn` to install the dependencies
7. Run `./docker/postgres-current/run.sh` to run a postgres instance (or roll your own!)
8. Run `./docker/mailhog/run.sh` to run a mail server for testing mails
9. Run `./database-make.sh` to make our database - assuming you're using default `.env`. If not, ignore this.
10. Run `./migrate-latest.sh` to run all migrations to the latest. We're using `knex` for migrations because sequelize
is bad at this if we're using typescript
11. Run `./seed-run.sh` to run all the seeding.
12. Run `yarn run debug` to run the development server.
13. Import the `Todo.postman-collection.json` in `docs`, so that you have all the APIs available for calling.
14. If you're new to `postman`, you'll need to create an environment. Then, use the `login` api to login. The `tests`
on login will assign the access token to the `todo_jwt_token` environment variable

## Testing the FCM

1. Install `app-debug.apk` in this directory for FCM (Firebase Cloud messaging aka push notification) testing.
If you're not using the `serviceAccountKey.json` provided, this `app-debug.apk` won't do anything.
We're using a forked FCM-toolbox (basically the same FCM-toolbox with `google-service.json` changed)
2. Assign the token from the FCM-toolbox app into one of the devices in the `devices` table.
3. Try adding a board, a user with the token to the board, and then a todo item. They should get the notification.

## Testing the FCM Authentication

Take note of the firebase credentials below:

```js

  var config = {
    apiKey: "AIzaSyDr6OVBNR15pLCJx_5oDECzS2vfPYuK9h4",
    authDomain: "aym-interview.firebaseapp.com",
    databaseURL: "https://aym-interview.firebaseio.com",
    projectId: "aym-interview",
    storageBucket: "aym-interview.appspot.com",
    messagingSenderId: "433236448838"
  };
  firebase.initializeApp(config);
  
```

See [https://github.com/firebase/firebaseui-web/tree/master/demo](https://github.com/firebase/firebaseui-web/tree/master/demo) and follow the instructions

You can use the credentials above to replace the default credentials in the repo above.

Once you have the server started and authenticated an account, the firebase token can then be obtained by doing the following inside the console:

```js

firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
  // Send token to your backend via HTTPS
  console.log("token: ", idToken)
}).catch(function(error) {
  // Handle error
});

```

This token can then be used for registration (see RegisterUsingFirebase), and for login.
