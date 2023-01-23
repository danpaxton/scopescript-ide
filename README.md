# ScopeScript IDE
App url: https://scopescript-ide.vercel.app/
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

### Terminal
The terminal at the bottom of the page can be used to write code line by line. On enter, the code will be executed and the value of the last statement will be displayed to the user. The terminal state is saved until refresh which allows the user to use previously declared variables in the terminal. Lastly, the terminal history is remembered and the user can navigate through previous entries using the up/down arrow keys. Similar to the terminal state, terminal history is also cleared on page refresh.

### Programs
The main program display allows the user to write several lines of code and manage multiple programs. If the user is not logged in (anoymous) they have the ability to run a single untitled program, download it to the their local machine, and clear the entire program. These programs cannot be saved. If the user wants to save files they can either create a new login or login with existing credentials. After a succesful login the new-file button should illuminate, once clicked the user is prompted with a textfield where they can enter a file name followed by '.sc'. After a file is loaded and a change has been made, the save button should now be illuminated allowing the user to save their code. The user can delete a file by clicking the delete button and then selecting the corresponding delete icon next to the file. After the user logs out the app will return to anonymous mode.

### Highlighter
Both the program and terminal components are supported by a custom language highlighter.
Codemirror Highlighter: https://github.com/danpaxton/codemirror-scopescript

## Frontend
The frontend was built using React.js and makes requests to the backend using Axios. The app is styled using a grid layout, Material UI, and Google Icons/Fonts. After login, the user's name and access token are stored in local storage to prevent logout on refresh. If an access token is close to expiration upon request the access token will be refreshed after api response. Using the Codemirror React component, the app retrieves user input (code) as raw text. ScopeScript is installed in the frontend, using a web worker, user code is parsed and interpreted without blocking the execution of the application.

## Backend
The backend was built using a flask rest api and connects to a postgres database using ElephantSql. User authentication was implemented using flask-jwt and automatically refreshes tokens close to expiration by checking time stamps after each request and appending the new token to the request response if the token needs to be refreshed. The api supports user login and creation along with the ability to fetch, delete, create, and update files. 
