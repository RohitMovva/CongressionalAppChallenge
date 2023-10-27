# from WebsiteV2.bruteForceShortestPath import getPath
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS  # <-- Import CORS
# import bruteForceShortestPath
app = Flask(__name__)
CORS(app)  # <-- Enable CORS for the app

def printyy(schedule):
    print(schedule)
new_schedule = [-1 for _ in range(8)]
def shortestPath(classes, schedule, original_schedule):
    # print(new_schedule)
    n = len(schedule)
    print("new call: ")
    printyy(new_schedule)
    print()
    if (n == 0):
        print("Finished")
        return 0
    
    
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
                
                next_path = shortestPath(classes, schedule[1:], original_schedule)
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
        return 1000000
    print(period, " ", class_loc)
    if (original_schedule[period] != classes[period][class_loc]): # original_schedule[period] != -1 and 
        lowval += 1

    return lowval

def getPath(classes, schedule, added_class, dropped_class):
    # new_schedule = [-1 for _ in range(8)]

    schedule[schedule.index(dropped_class)] = added_class
    new_schedule = [-1 for _ in range(8)]
    shortestPath(classes, schedule, schedule)
    print("HEYO")
    print(new_schedule)



def process_form(class_list):
    classes = set({})
    for i in class_list.split("\n")[1:]:
        classes.add(i.split(',')[0])
    return sorted(list(classes))

@app.route('/')
def hello(class_string):
    classes = set({})
    for i in class_string.split("\n")[1:]:
        classes.add(i.split(',')[0])

@app.route('/api/upload-form', methods=['POST'])
def upload_form():
    data = request.get_json()
    name = data.get("username", "Guest")
    
    return jsonify({"message": "Success!", "class_list": process_form(name)})

@app.route('/api/upload-all', methods=['POST'])
def get_shortest_switches():
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
    getPath(class_list, student_schedule, added_course, dropped_course)
    # schedule = new_schedule
    # new_schedule = [-1 for _ in range(8)]
    # new_schedule = new_schedule
    temp =  jsonify({"message": "Success!", "new_schedule": new_schedule})
    # new_schedule = [-1 for _ in range(8)]
    return temp



if __name__ == '__main__':
    app.run(debug=True)
    #test test
