from flask import Flask, render_template, request, jsonify
import os, json
from werkzeug.security import check_password_hash
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

with open('passcode.txt', 'r') as file:
    stored_hash = file.read().strip()

DATA_FILE = 'data.json'

@app.route('/')
def login():
    return render_template('login_page.html')

@app.route('/standalone')
def go_to_standalone():
    return render_template('standalone.html')

@app.route('/loadData', methods=['GET'])
def get_data():
    if not os.path.exists(DATA_FILE):
        return jsonify({})
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/saveData', methods=['POST'])
def update_data():
    new_data = request.get_json()
    with open(DATA_FILE, 'w') as f:
        json.dump(new_data, f, indent=2)
    return jsonify({'status': 'success'})


@app.route('/main')
def main_page():
    return render_template("main_page.html")

@app.route('/schedule')
def schedule():
    return render_template("schedule.html")

@app.route('/check_passcode', methods=['POST'])
def check_passcode():
    data = request.get_json()
    user_passcode = data.get('passcode', '')

    if check_password_hash(stored_hash, user_passcode):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})


if __name__ == '__main__':
    app.run(debug=True)
