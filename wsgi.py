import json, os
from datetime import timedelta, timezone, datetime

from flask import Flask, request
from flask.helpers import send_from_directory
from flask_jwt_extended import create_access_token, get_jwt, jwt_required, JWTManager, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
# Load environment variables, development only.
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__, static_folder="client/build", static_url_path="")
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)
db = SQLAlchemy(app)
CORS(app)


# Database models

class User(db.Model):
    id = db.Column(db.INTEGER, primary_key=True, nullable=False)
    username = db.Column(db.VARCHAR(50), nullable=False)
    password = db.Column(db.TEXT, nullable=False)
    files = db.relationship('File', backref='user', order_by='File.id')
    targets = db.relationship('Target', backref='user', order_by='Target.id')

    def check_password(self, password):
        return check_password_hash(self.password, password)


class File(db.Model):
    user_id = db.Column(db.INTEGER, db.ForeignKey('user.id'), nullable=False)
    id = db.Column(db.INTEGER, primary_key=True, nullable=False)
    title = db.Column(db.VARCHAR(103), nullable=False)
    source_code = db.Column(db.TEXT, nullable=False)


class Target(db.Model):
    user_id = db.Column(db.INTEGER, db.ForeignKey('user.id'), nullable=False)
    id = db.Column(db.INTEGER, primary_key=True, nullable=False)
    name = db.Column(db.VARCHAR(50), nullable=False)
    messages = db.relationship('Message', backref='target', order_by='Message.id')


class Message(db.Model):
    target_id = db.Column(db.INTEGER, db.ForeignKey('target.id'), nullable=False)
    id = db.Column(db.INTEGER, primary_key=True, nullable=False)
    sent = db.Column(db.BOOLEAN, nullable=False)
    text = db.Column(db.TEXT, nullable=False)
    code = db.Column(db.BOOLEAN, nullable=False)
    title = db.Column(db.VARCHAR(103), nullable=False)


# Setup

@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=current_user)
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response


# Helper Functions

def decrement(num):
    return num - 1 if num else num + 1


def format_file(file):
    return dict(id=file.id, title=file.title, code=file.source_code)


def format_target(target):
    messages = [ dict(sent=m.sent, code=m.code, title=m.title, text=m.text) for m in target.messages ]
    return dict(id=target.id, name=target.name, messages=messages)


def binary_search(list, id):
    l, r = 0, len(list) - 1
    target = int(id)
    while (l <= r):
        m = l + (r - l) // 2
        if list[m].id < target:
            l = m + 1
        elif list[m].id > target:
            r = m - 1
        else:
            return (m, list[m])
    
    return (-1, None)


# Routes

@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.get_json()   
    username = data['username'].lower()
    user = User.query.filter_by(username=username).one_or_none()
    if user and user.check_password(data['password']):
        return dict(username=username, access_token=create_access_token(identity=user))

    return { 'log': 'Invalid login credentials' }, 401


@app.route('/new-user', methods=['POST'])
@cross_origin()
def new_user():
    data = request.get_json()
    name = data['username'].lower()
    user = User.query.filter_by(username=name).one_or_none()
    if not user:
        user = User(username=name, password=generate_password_hash(data['password']))
        db.session.add(user)
        db.session.commit()
        return { 'log': 'user created successfully.' }
    
    return { 'log': 'user already exists.'}, 401


@app.route('/new-file', methods=['POST'])
@cross_origin()
@jwt_required()
def new_file():
    data = request.get_json()
    file = File(title=data['title'], source_code=data['code'], user=current_user)
    db.session.add(file)
    db.session.commit()
    return { 'file': format_file(file) }


@app.route('/new-target', methods=['POST'])
@cross_origin()
@jwt_required()
def new_target():
    name = request.json['name'].lower()
    if not User.query.filter_by(username=name).one_or_none():
        return { 'log': 'User does not exist.' }, 401

    for t in current_user.targets:
        if t.name == name:
            return { 'target': format_target(t) }

    new_target = Target(name=name, user=current_user)
    db.session.add(new_target)
    db.session.commit()
    return { 'target': format_target(new_target) }


@app.route('/fetch-files', methods=['GET'])
@cross_origin()
@jwt_required()
def fetch_files():
    return { 'files': [format_file(file) for file in current_user.files] }


@app.route('/fetch-targets', methods=['GET'])
@cross_origin()
@jwt_required()
def fetch_targets():
    return { 'targets': [format_target(t) for t in current_user.targets] }


@app.route('/operate-file/<id>', methods=['GET', 'DELETE', 'PUT'])
@cross_origin()
@jwt_required()
def operate_file(id):
    files = current_user.files
    pos, file = binary_search(files, id)
    if not file:
        return { 'log': 'File does not exist.'}, 401

    if request.method == 'GET':
        return { 'file': format_file(file) }
    elif request.method == 'PUT':
        # Receives json object on put.
        file.source_code = request.json['code']
        db.session.commit()
        return { 'log': 'file updated.' }
    else:
        # Return next possible file on list.
        next = { 'file': None }
        if len(current_user.files) > 1:
            next['file'] = format_file(files[decrement(pos)])
        
        db.session.delete(file)
        db.session.commit()

        return next


@app.route('/operate-target/<id>', methods=['GET', 'DELETE', 'POST'])
@cross_origin()
@jwt_required()
def operate_target(id):
    targets = current_user.targets
    pos, target = binary_search(targets, id)
    if not target:
        return { 'log': 'unknown message target.' }, 401

    if request.method == 'GET':
        return { 'target': format_target(target) }
    elif request.method == 'DELETE':
        # Return next possible target on list.
        next = { 'target': None }
        if len(targets) > 1:
            next['target'] = format_target(targets[decrement(pos)])
        
        for m in target.messages:
            db.session.delete(m)

        db.session.delete(target)
        db.session.commit()

        return next
    else:
        data = request.get_json()
        text, name, code, title = data['text'], data['name'].lower(), data['code'], data['title']
        # Edit recipients messages.
        user = User.query.filter_by(username=name).one_or_none()
        if not user:
            return { 'log': 'User does not exist.' }, 401

        curr_ref, curr_name = None, current_user.username
        for t in user.targets:
            if t.name == curr_name:
                curr_ref = t
        
        if not curr_ref:
            curr_ref = Target(name=curr_name, user=user)
            db.session.add(curr_ref)

        # Sends message to target.
        sent_message = Message(sent=True, code=code, text=text, title=title, target=target)
        # Target receives message.
        received_message = Message(sent=False, code=code, text=text,  title=title, target=curr_ref)
        db.session.add(sent_message)
        db.session.add(received_message)
        db.session.commit()

        return { 'target': format_target(target) }


@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')
