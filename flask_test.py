# from WebsiteV2.bruteForceShortestPath import getPath
import random
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS  # <-- Import CORS
import pickle
# import bruteForceShortestPath
app = Flask(__name__)
CORS(app)  # <-- Enable CORS for the app

id = -1

def load_object(filename):
    try:
        with open(filename, "rb") as f:
            return pickle.load(f)
    except Exception as ex:
        print("Error during unpickling object (Possibly unsupported):", ex)
        return None

def save_object(filename, data):
    # data = sorted(data, key = lambda x: x[4], reverse=True)
    try:
        with open(filename, "wb") as f:
            return pickle.dump(data, f)
    except Exception as ex:
        print("Error during unpickling object (Possibly unsupported):", ex)
        return None

# new_schedule = [-1 for _ in range(8)]
def shortestPath(classes, schedule, original_schedule, new_schedule):
    # print(new_schedule)
    n = len(schedule)
    print("new call: ", new_schedule)
    if (n == 0):
        print("Finished")
        return (new_schedule, 0)
    
    lowval = 100000
    class_loc = -1
    period = -1
    # i = 8-n
    # new_schedule.append("-1")
    for i in range(0, 8):
        for j in range (0, len(classes[i])):
            # print(classes[i][j] + " " + schedule[0])
            # if (classes[i][j] == "AP Biology"):
            #     print(i, " ", j)
            if (classes[i][j] == schedule[0] and new_schedule[i] == -1):

                # print("YOAOETOWA\n\n\n\n")
                # print(classes[i][j], "trying this class")
                # lowval = min(lowval, shortestPath(classes, schedule[1:]))
                
                # print(str(len(new_schedule)) + " " + str(i))
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
                # print("new low cost :P", new_schedule)

        # print("\n\n")
    if (class_loc == -1):
        # print("Dead end")
        return (new_schedule, 1000000)
    print(period, " ", class_loc)
    if (original_schedule[period] != classes[period][class_loc]): # original_schedule[period] != -1 and 
        lowval += 1

    return (new_schedule, lowval)

def getPath(classes, schedule, added_class, dropped_class):
    # new_schedule = [-1 for _ in range(8)]

    schedule[schedule.index(dropped_class)] = added_class
    # new_schedule = [-1 for _ in range(8)]
    new_schedule = shortestPath(classes, schedule, schedule, [-1 for _ in range(8)])[0]
    print("HEYO")
    print(new_schedule)
    return new_schedule



def process_form(class_list):
    classes = set({})
    for i in class_list.split("\n")[1:]:
        classes.add(i.split(',')[0])
    return sorted(list(classes))

@app.route('/')
def hello(class_string):
    if (request.get_json()["id"] != id):
        return
    classes = set({})
    for i in class_string.split("\n")[1:]:
        classes.add(i.split(',')[0])

@app.route('/api/upload-form', methods=['POST'])
def upload_form():
    if (request.get_json()["id"] != id):
        return
    data = request.get_json()
    name = data.get("username", "Guest")
    
    return jsonify({"message": "Success!", "class_list": process_form(name)})

@app.route('/api/upload-all', methods=['POST'])
def get_shortest_switches():
    if (request.get_json()["id"] != id):
        return
    print("asdigo")
    raw_class_list = request.get_json()['classes']
    class_list = [[] for _ in range(8)]
    for line in raw_class_list.split("\n")[1:]:
        line = line.split(",")
        # if (int(line[4]) < int(line[5][:-1])): # 4 5
        class_list[int(line[3])-1].append(line[0])
    student_schedule = request.get_json()['schedule']
    added_course = request.get_json()['added_course']
    dropped_course = request.get_json()['dropped_course']
    # getPath(class_list, student_schedule, added_course, dropped_course)
    new_schedule = getPath(class_list, student_schedule, added_course, dropped_course)
    # schedule = new_schedule
    # new_schedule = [-1 for _ in range(8)]
    # new_schedule = new_schedule
    # new_schedule = [-1 for _ in range(8)]
    return jsonify({"message": "Success!", "new_schedule": new_schedule})

@app.route('/api/create-account', methods=['POST'])
def create_account():
    # request = request
    username = request.get_json()['username']
    password = request.get_json()['password']
    account_dict = load_object("account_credentials")
    if (account_dict == None):
        account_dict = {}
    if (username in account_dict[username]):
        return jsonify({"code": -1, "id": -1})
    account_dict[username] = password
    save_object("account_credentials", account_dict)
    id = random.randint(10000000, 99999999)
    
    return jsonify({"code": 1, "id": id})

@app.route('/api/login', methods=['POST'])
def login():
    username = request.get_json()['username']
    password = request.get_json()['password']
    account_dict = load_object("account_credentials")
    if (account_dict[username] != password):
        return jsonify({"code": 0, "id": -1})
    id = random.randint(10000000, 99999999)
    return jsonify({"code": 1, "id": id})

if __name__ == '__main__':
    app.run(debug=True)
    #test test
