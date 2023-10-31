# from WebsiteV2.bruteForceShortestPath import getPath
import random
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import time
app = Flask(__name__)
CORS(app)

def load_object(filename):
    try:
        with open(filename, "rb") as f:
            return pickle.load(f)
    except Exception as ex:
        return None

def save_object(filename, data):
    # data = sorted(data, key = lambda x: x[4], reverse=True)
    try:
        with open(filename, "wb") as f:
            return pickle.dump(data, f)
    except Exception as ex:
        return None

# new_schedule = [-1 for _ in range(8)]
def shortestPath(classes, schedule, original_schedule, new_schedule):
    n = len(schedule)
    if (n == 0):
        return (new_schedule, 0)
    
    lowval = 100000
    class_loc = -1
    period = -1
    # i = 8-n
    # new_schedule.append("-1")
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
    if (original_schedule[period] != classes[period][class_loc][0]): # original_schedule[period] != -1 and 
        lowval += 1

    return (new_schedule, lowval)

def getPath(classes, schedule, added_class, dropped_class, username):
    # new_schedule = [-1 for _ in range(8)]
    only_classes = []
    all_info = []
    for i in schedule:
        subthing = i.split(", ")
        only_classes.append(subthing[0])
        # all_info.append(classes.index)
        for j in classes[int(subthing[2])]:
            if j[1][0] == subthing[0] and j[1][1] == subthing[1]:
                all_info.append(j[1])
                break

    only_classes[only_classes.index(dropped_class)] = added_class
    # new_schedule = [-1 for _ in range(8)]
    new_schedule = shortestPath(classes, only_classes, only_classes, [-1 for _ in range(8)])[0]
    new_schedule = [i[1][0:4] for i in new_schedule]
    past_schedules = load_object("past_schedules.pkl")
    if (past_schedules == None):
        past_schedules = {}
    if (username not in past_schedules):
        past_schedules[username] = []
    past_schedules[username].append((all_info, new_schedule))
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
    # data = request.get_json()
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
        # if (int(line[4]) < int(line[5][:-1])): # 4 5
        class_list[int(line[3])-1].append(((line[0], line)))
    student_schedule = request.get_json()['schedule']
    added_course = request.get_json()['added_course']
    dropped_course = request.get_json()['dropped_course']
    # getPath(class_list, student_schedule, added_course, dropped_course)
    new_schedule = getPath(class_list, student_schedule, added_course, dropped_course, username)
    # schedule = new_schedule
    # new_schedule = [-1 for _ in range(8)]
    # new_schedule = new_schedule
    # new_schedule = [-1 for _ in range(8)]
    # new_schedule = [i[1][0:4] for i in new_schedule]
    return jsonify({"code": 1, "message": "Success!", "new_schedule": new_schedule})

@app.route('/api/create-account', methods=['POST'])
def create_account():
    # request = request
    username = request.get_json()['username']
    password = request.get_json()['password']
    account_dict = load_object("account_credentials")
    if (account_dict == None):
        account_dict = {}
    if (username in account_dict):
        return jsonify({"code": -1, "id": -1})
    account_dict[username] = password
    save_object("account_credentials", account_dict)
    id = random.randint(10000000, 99999999)
    save_object("id.pkl", [id, username])
    return jsonify({"code": 1, "id": id})

@app.route('/api/login', methods=['POST'])
def login():
    username = request.get_json()['username']
    password = request.get_json()['password']
    account_dict = load_object("account_credentials")
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
    else:
        return jsonify({"valid": int(id[0])==int(frontend_id)})
    # return jsonify({"valid": id == frontend_id})

@app.route("/api/latest-schedule", methods=['POST'])
def get_latest_schedule():
    # return jsonify({"code": -1})
    frontend_id = request.get_json()['id']
    id = load_object("id.pkl")
    if (id == None or int(id[0]) != int(frontend_id)):
        return jsonify({"code": -1})
    username = id[1]
    id = id[0]
    latest_schedule = load_object("past_schedules.pkl")
    if (latest_schedule == None or len(latest_schedule) == 0):
        return jsonify({"code": 0})
    return jsonify({"code": 1, "schedule": latest_schedule[username][-1][1]})

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
    # parsed_sched)
    
    for i in latest_schedule[username]:
        parsed_schedules[0].append([])
        parsed_schedules[1].append([])
        for j in range (0, 8):
            i[0][j] = i[0][j][0:4]

            if (i[0][j] not in i[1]):
                parsed_schedules[1][-1].append(("dropped", i[0][j]))
            else :
                parsed_schedules[1][-1].append(("original", i[1][j]))

            if (i[1][j] not in i[0]):
                parsed_schedules[0][-1].append(("added", i[1][j]))
            elif (i[1][j] != i[0][j]):
                parsed_schedules[0][-1].append(("changed", i[1][j]))
            else:
                parsed_schedules[0][-1].append(("same", i[1][j]))
    print(parsed_schedules)
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
    sorted(class_list[request.get_json()['period']])
    return jsonify({"code": 1, "classes": class_list[request.get_json()['period']]})

if __name__ == '__main__':
    app.run(debug=True)
    #test test
