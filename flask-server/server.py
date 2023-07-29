import base64
import hashlib
import time
import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)



@app.route("/sim", methods = ["POST"])
def sim():

    data = request.get_json()
    algo = data.get('selectedAlgorithm', '')
    crypto = data.get('selectedCrypto', '')
    getproj = {
    ('BTCUSD', 'Low Risk, Low Reward (LSTM Machine learning Simple Moving Average)'): 15429238,
    ('BTCUSD', 'High Risk, High Reward (Dual Thrust Trading)'): 15429301, 
    ('BTCUSD', 'Moderate Risk, Moderate Reward (Momentum Trading)'): 15429354,
    ('ETHUSD', 'Low Risk, Low Reward (LSTM Machine learning Simple Moving Average)'): 15429250,
    ('ETHUSD', 'High Risk, High Reward (Dual Thrust Trading)'): 15429310,
    ('ETHUSD', 'Moderate Risk, Moderate Reward (Momentum Trading)'): 15429366,
    ('USDT', 'Low Risk, Low Reward (LSTM Machine learning Simple Moving Average)'): 15429257,
    ('USDT', 'High Risk, High Reward (Dual Thrust Trading)'): 15429324,
    ('USDT', 'Moderate Risk, Moderate Reward (Momentum Trading)'): 15429370,
    ('XRPUSD', 'Low Risk, Low Reward (LSTM Machine learning Simple Moving Average)'): 15429273,
    ('XRPUSD', 'High Risk, High Reward (Dual Thrust Trading)'): 15429327,
    ('XRPUSD', 'Moderate Risk, Moderate Reward (Momentum Trading)'): 15429377,
    ('BNBUSD', 'Low Risk, Low Reward (LSTM Machine learning Simple Moving Average)'): 15429282,
    ('BNBUSD', 'High Risk, High Reward (Dual Thrust Trading)'): 15429330,
    ('BNBUSD', 'Moderate Risk, Moderate Reward (Momentum Trading)'): 15429381,
}

    # selector = dict("LSTM Machine learning Simple Moving Average" = "245777")


    # Replace these variables with your actual API token and user ID
    api_token = '0e4d62c69bd6c42ca078dce2982971543fdef1e9d7c8a1a553e40e35aaafd69c'
    user_id = '245893'

    # Get timestamp
    timestamp = str(int(time.time()))
    time_stamped_token = api_token + ':' + timestamp
    projId = getproj.get((crypto, algo), 15429238)

    # Get hashed API token
    hashed_token = hashlib.sha256(time_stamped_token.encode('utf-8')).hexdigest()
    authentication = "{}:{}".format(user_id, hashed_token)
    api_token = base64.b64encode(authentication.encode('utf-8')).decode('ascii')


    comp = "https://www.quantconnect.com/api/v2/compile/create"
    back_create = "https://www.quantconnect.com/api/v2/backtests/create"
    back_read = "https://www.quantconnect.com/api/v2/backtests/read"

    # Create headers dictionary.
    headers = {
        'Authorization': 'Basic %s' % api_token,
        'Timestamp': timestamp
    }

    # Create POST Request with headers (optional: Json Content as data argument).
    response = requests.post(comp, data={
        "projectId": projId

    }, headers=headers)





    # Print the API response
    parsed_response = json.loads(response.text)

    response2 = requests.post(back_create, data={
        "projectId": projId,
        "compileId": parsed_response['compileId'],
        "backtestName": "run1"

    }, headers=headers)
    
    parsed_response2 = json.loads(response2.text)
    print(parsed_response2)
    time.sleep(4)
    backtest_id = parsed_response2["backtest"]["backtestId"]


    while True:
        time.sleep(2)
        response3 = requests.post(back_read, data={
        "projectId": projId,
        "backtestId": backtest_id

        }, headers=headers) 
        parsed_response3 = json.loads(response3.text)
        if parsed_response3["backtest"]["completed"]:
            break
    print('Backtest results recieved')
    # print(parsed_response3)
    return jsonify({"value": parsed_response3})

if __name__ == "__main__":
    app.run(debug=True)