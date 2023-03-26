from flask import Flask, jsonify, request
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from api.InferenceApiHandler import InferenceApiHandler

app = Flask(__name__)
CORS(app)
api = Api(app)

@app.route('/')
def index():
    return jsonify({
        'resultStatus': 'SUCCESS',
        'message': "Server is running"
    })

api.add_resource(InferenceApiHandler, '/api/inference')