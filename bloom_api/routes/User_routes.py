from flask import Blueprint, jsonify, request
import json
import requests
from googletrans import Translator

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/', methods=['GET'])
def get_users():
    return "OK"

@user_routes.route('/gptbloom', methods=['POST'])
def api_gptBloom():
    # https://huggingface.co/docs/api-inference/detailed_parameters#text-generation-task
    API_URL = "https://api-inference.huggingface.co/models/bigscience/bloom"
    headers = {"Authorization": "Bearer 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"}

    parameters = {
        "max_new_tokens": 200,
        "temperature": 0.9,
        "top_p": 0.9,
        "top_k": 50,
        "seed": 42,
        "return_full_text": False,
        "early_stopping": False,
        "length_penalty": 0.0,
        "eos_token_id": None,
    }

    request_body = request.json
    translator = Translator()
    input_t = translator.translate(request_body['texto'], dest='en').text

    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()

    output = query({
        "inputs": input_t,
        "parameters": parameters,
        "options": {
            "use_cache": False
        }
    })
    output = output[0]['generated_text'][len(input_t):]
    output = translator.translate(output, dest='es').text
    return jsonify({'text': output})


@user_routes.route('/gptbloomChatBot', methods=['POST'])
def api_gptBloom_chatbot():
    API_URL = "https://api-inference.huggingface.co/models/bigscience/bloom"
    headers = {"Authorization": "Bearer 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"}

    parameters = {
        "max_new_tokens": 100,
        "temperature": 0.9,
        "top_p": 0.9,
        "top_k": 50,
        "seed": 42,
        "return_full_text": False,
        "early_stopping": False,
        "length_penalty": 0.0,
        "eos_token_id": None,
    }

    text = request.json['texto'] + "\nAI: "
    print(text)

    translator = Translator()
    input_t = translator.translate(text, dest='en').text

    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()

    output = query({
        "inputs": input_t,
        "parameters": parameters,
        "options": {
            "use_cache": False
        }
    })

    output = output[0]['generated_text'][len(input_t):]
    if ("Human:" in output):
        output = output[:output.index("Human:")]
    output = translator.translate(output, dest='es').text
    print(output)
    return jsonify({'text': output})


@user_routes.route('/translateES', methods=['POST'])
def t_es():
    request_body = request.json
    translator = Translator()
    output = translator.translate(request_body['texto'], dest='es').text
    return jsonify({'text': output})


@user_routes.route('/translateEN', methods=['POST'])
def t_en():
    request_body = request.json
    translator = Translator()
    output = translator.translate(request_body['texto'], dest='en').text
    return jsonify({'text': output})
