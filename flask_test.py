import random
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
from datetime import datetime, date
app = Flask(__name__)
CORS(app)

def load_object(filename):
    try:
        with open(filename, "rb") as f:
            return pickle.load(f)
    except Exception as ex:
        return None

def save_object(filename, data):
    try:
        with open(filename, "wb") as f:
            return pickle.dump(data, f)
    except Exception as ex:
        return None

def shortestPath(classes, schedule, original_schedule, new_schedule):
    n = len(schedule)
    if (n == 0):
        return (new_schedule, 0)
    
    lowval = 100000
    class_loc = -1
    period = -1
    for i in range(0, 8):
        for j in range (0, len(classes[i])):
            if (classes[i][j][0] == schedule[0] and new_schedule[i] == -1):
                temp = -1
                if (period != -1):
                    temp = new_schedule[period]
                    new_schedule[period] = -1
                new_schedule[i] = classes[i][j]
                
                next_path = shortestPath(classes, schedule[1:], original_schedule, new_schedule)[1]
                if (lowval <= next_path):
                    new_schedule[i] = -1
                    if (period != -1):
                        new_schedule[period] = temp
                    continue

                lowval = next_path
                class_loc = j
                period = i

    if (class_loc == -1):
        return (new_schedule, 1000000)
    if (original_schedule[period] != classes[period][class_loc][0]):
        lowval += 1

    return (new_schedule, lowval)

def getPath(classes, schedule, added_class, dropped_class, username):
    only_classes = []
    all_info = []
    for i in schedule:
        subthing = i.split(", ")
        only_classes.append(subthing[0])
        for j in classes[int(subthing[2])]:
            if j[1][0] == subthing[0] and j[1][1] == subthing[1]:
                all_info.append(j[1])
                break

    only_classes[only_classes.index(dropped_class)] = added_class
    new_schedule = shortestPath(classes, only_classes, only_classes, [-1 for _ in range(8)])[0]
    if (-1 in new_schedule):
        return new_schedule
    new_schedule = [i[1][0:4] for i in new_schedule]
    past_schedules = load_object("past_schedules.pkl")
    if (past_schedules == None):
        past_schedules = {}
    if (username not in past_schedules):
        past_schedules[username] = []
    timestamp = date.today()
    date_time = timestamp.strftime("%m/%d/%Y")
    past_schedules[username].append((all_info, new_schedule, date_time))
    save_object("past_schedules.pkl", past_schedules)
    return new_schedule

def process_form(class_list):
    classes = set({})
    for i in class_list.split("\n")[1:]:
        classes.add(i.split(',')[0])
    return sorted(list(classes))

@app.route('/')
def hello(class_string):
    if (request.get_json()["id"] != id):
        return jsonify({"code": 0, "message": "Failure!"})
    classes = set({})
    for i in class_string.split("\n")[1:]:
        classes.add(i.split(',')[0])

@app.route('/api/upload-form', methods=['POST'])
def upload_form():
    
    id = load_object("id.pkl")
    if (id == None):
        return jsonify({"code": 0, "message": "Failure!"})
    id = id[0]
    if (int(request.get_json()["id"]) != id or request.get_json()["id"] == -1):
        return jsonify({"code": 0, "message": "Failure!"})
    if (int(request.get_json()["id"]) != id or request.get_json()["id"] == -1):
        return jsonify({"code": 0, "message": "Failure!"})
    name = request.get_json()["file_text"]
    return jsonify({"code": 1, "message": "Success!", "class_list": process_form(name)})

@app.route('/api/upload-all', methods=['POST'])
def get_shortest_switches():
    id = load_object("id.pkl")
    if (id == None):
        return jsonify({"code": 0, "message": "Failure!"})
    username = id[1]
    id = id[0]
    if (int(request.get_json()["id"]) != id or request.get_json()["id"] == -1):
        return jsonify({"code": 0, "message": "Failure!"})
    raw_class_list = request.get_json()['classes']
    class_list = [[] for _ in range(8)]
    for line in raw_class_list.split("\n")[1:]:
        line = line.split(",")
        class_list[int(line[3])-1].append(((line[0], line)))
    student_schedule = request.get_json()['schedule']
    added_course = request.get_json()['added_course']
    dropped_course = request.get_json()['dropped_course']
    new_schedule = getPath(class_list, student_schedule, added_course, dropped_course, username)
    print(new_schedule)
    if (-1 in new_schedule):
        return jsonify({"code": -1, "message": "Success!", "new_schedule": new_schedule})
    return jsonify({"code": 1, "message": "Success!", "new_schedule": new_schedule})

@app.route('/api/create-account', methods=['POST'])
def create_account():
    username = request.get_json()['username']
    password = request.get_json()['password']
    account_dict = load_object("account_credentials.pkl")
    if (account_dict == None):
        account_dict = {}
    if (username in account_dict):
        return jsonify({"code": -1, "id": -1})
    account_dict[username] = password
    save_object("account_credentials.pkl", account_dict)
    id = random.randint(10000000, 99999999)
    save_object("id.pkl", [id, username])
    return jsonify({"code": 1, "id": id})

@app.route('/api/login', methods=['POST'])
def login():
    username = request.get_json()['username']
    password = request.get_json()['password']
    account_dict = load_object("account_credentials.pkl")
    if (account_dict == None):
        account_dict = {}
    if (username not in account_dict or account_dict[username] != password):
        return jsonify({"code": 0, "id": -1})
    id = random.randint(10000000, 99999999)
    save_object("id.pkl", [id, username])
    return jsonify({"code": 1, "id": id})

@app.route('/api/verify-id', methods=['POST'])
def verify_id():
    frontend_id = request.get_json()['id']
    id = load_object("id.pkl")
    if (id == None):
        return jsonify({"valid": False})
    id = id[0]
    return jsonify({"valid": int(id)==int(frontend_id)})

@app.route("/api/latest-schedule", methods=['POST'])
def get_latest_schedule():
    frontend_id = request.get_json()['id']
    id = load_object("id.pkl")
    if (id == None):
        return jsonify({"code": -1})
    username = id[1]
    id = id[0]
    if (int(id) != int(frontend_id)):
        return jsonify({"code": -1})
    
    latest_schedule = load_object("past_schedules.pkl")
    if (latest_schedule == None or len(latest_schedule) == 0):
        return jsonify({"code": 0})
    parsed_schedule = []
    for i in range(0, 8):
        if (type(i) == str):
            continue
        
        latest_schedule[username][-1][0][i] = latest_schedule[username][-1][0][i][0:4]
        flaggy = False
        for k in latest_schedule[username][-1][0]:
            if k[0] == latest_schedule[username][-1][1][i][0]:
                flaggy = True

        if (not flaggy):
            parsed_schedule.append(("added",  latest_schedule[username][-1][1][i]))
        elif (latest_schedule[username][-1][1][i][0] == latest_schedule[username][-1][0][i][0]):
            parsed_schedule.append(("original",  latest_schedule[username][-1][1][i]))
        else:
            parsed_schedule.append(("changed",  latest_schedule[username][-1][1][i]))

    return jsonify({"code": 1, "schedule": parsed_schedule})

@app.route("/api/get-schedules", methods=['Post'])
def get_schedules():
    frontend_id = request.get_json()['id']
    id = load_object("id.pkl")
    if (id == None or int(id[0]) != int(frontend_id)):
        return jsonify({"code": -1})
    username = id[1]
    id = id[0]
    latest_schedule = load_object("past_schedules.pkl")
    if (latest_schedule == None or len(latest_schedule) == 0):
        return jsonify({"code": 0})
    parsed_schedules = [[], []]
    latest_schedule[username].reverse()
    
    for i in latest_schedule[username]:
        parsed_schedules[0].append([])
        parsed_schedules[1].append([])
        for j in range (0, 8):
            i[0][j] = i[0][j][0:4]
            flaggy = False
            for k in i[1]:
                if k[0] == i[0][j][0]:
                    flaggy = True

            flaggyv2 = False
            for k in i[0]:
                if k[0] == i[1][j][0]:
                    flaggyv2 = True

            if (not flaggy):
                parsed_schedules[1][-1].append(("dropped", i[0][j]))

            elif (i[0][j] == i[1][j]):
                parsed_schedules[1][-1].append(("original", i[0][j]))
            else:
                parsed_schedules[1][-1].append(("changed", i[0][j]))

            if (not flaggyv2):
                parsed_schedules[0][-1].append(("added", i[1][j]))
            elif (i[1][j] != i[0][j]):
                parsed_schedules[0][-1].append(("changed", i[1][j]))
            else:
                parsed_schedules[0][-1].append(("same", i[1][j]))
        parsed_schedules[0][-1].append(i[2])
        parsed_schedules[1][-1].append(i[2])
    return jsonify({"code": 1, "schedules": parsed_schedules})

@app.route("/api/get-courses-in-period", methods=['Post'])
def get_courses():
    frontend_id = request.get_json()['id']
    id = load_object("id.pkl")
    
    if (id == None or int(id[0]) != int(frontend_id)):
        return jsonify({"code": -1})
    raw_class_list = request.get_json()['classes']
    class_list = [[] for _ in range(8)]
    for line in raw_class_list.split("\n")[1:]:
        line = line.split(",")
        class_list[int(line[3])-1].append(line)
    return jsonify({"code": 1, "classes": sorted(class_list[request.get_json()['period']])})

if __name__ == '__main__':
    app.run(debug=True)
