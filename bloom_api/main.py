from flask import Flask
from flask_cors import CORS
from routes.User_routes import user_routes

app = Flask(__name__)
CORS(app)

app.register_blueprint(user_routes)


# https://docs.deta.sh/docs/micros/getting_started/#creating-your-first-micro
if __name__ == '__main__':
	app.run(debug=True, host="localhost", port=7000)
