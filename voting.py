from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

votes = {}
candidates = []

for candidate in candidates:
    votes[candidate] = 0

@app.route('/candidates')
def get_candidates():
    return jsonify(candidates)

@app.route('/vote', methods=['POST'])
def cast_vote():
    data = request.get_json()
    candidate = data.get('candidate')
    if candidate in votes:
        votes[candidate] += 1
        return jsonify({'message': f'Vote cast for {candidate} successfully!'}), 200
    else:
        return jsonify({'error': 'Invalid candidate'}), 400

@app.route('/results')
def get_results():
    return jsonify(votes)

if __name__ == '__main__':
    app.run(debug=True)