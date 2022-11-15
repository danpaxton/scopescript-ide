# ScopeScript IDE
App url: https://scopescript-dvnd7114p-danpaxton.vercel.app/
## Running client locally.

Clone repository.
```console
$ git clone https://github.com/danpaxton/scopescript-ide.git
$ cd scope-script-ide
```

Install client dependencies and run.
```console
$ cd client
$ npm install
$ npm run start
```
The client should now be running on localhost port 3000.

## Usage
### Anonymous mode.
If the user is not logged in, the application will work for running an untitled program and downloading it to the user's local machine. These programs cannot be saved.

### User mode.
The user can either create a new login or login with existing credentials. After a succesful login the new-file button should illuminate, once clicked the user is prompted with a textfield where they can enter a file name followed by '.sc'. After a file is loaded and a change has been made, the save button should now be illuminated allowing the user to save their code. The user can delete a file by clicking the delete button and then selecting the corresponding delete icon next to the file. After the user logs out the app will return to anonymous mode.

Codemirror Highlighter: https://github.com/danpaxton/codemirror-scopescript

## Frontend
The frontend was built using React.js and makes requests to the backend using Axios. The app is styled using a grid layout, Material UI, and Google Icons/Fonts. After login, the user's name and access token are stored in local storage to prevent logout on refresh. If an access token is close to expiration upon request the access token will be refreshed after api response. Using the Codemirror React component, the app retrieves user input (code) as raw text. ScopeScript is installed in the frontend, using a web worker, user code is parsed and interpreted without blocking the execution of the application.


## Backend
Backend was built using a flask rest api and connects to a postgres database using ElephantSql. User authentication was implemented using flask-jwt and automatically refreshes tokens close to expiration by checking time stamps after each request and appending the new token to the request response if the token needs to be refreshed. The api supports user login and creation along with the ability to fetch, delete, create, and update file(s). 
