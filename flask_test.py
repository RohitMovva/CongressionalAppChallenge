from flask import Flask, jsonify, request
from flask_cors import CORS  # <-- Import CORS

app = Flask(__name__)
CORS(app)  # <-- Enable CORS for the app

def process_form(class_list):
    classes = set({})
    for i in class_list.split("\n")[1:]:
        print("adding...\n")
        classes.add(i.split(',')[0])
    print(classes)
    return sorted(list(classes))

@app.route('/')
def hello(class_string):
    classes = set({})
    for i in class_string.split("\n")[1:]:
        print("adding...\n")
        classes.add(i.split(',')[0])

@app.route('/api/upload-form', methods=['POST'])
def upload_form():
    print("called")
    data = request.get_json()
    name = data.get("username", "Guest")
    
    return jsonify({"message": "Success!", "class_list": process_form(name)})

@app.route('/api/upload-all', methods=['POST'])
def get_shortest_switches():
    print("called")
    raw_class_list = request.get_json("classes")['classes']
    class_list = [[] for _ in range(8)]
    # class_list = []*8.
    # print(class_list)
    for line in raw_class_list.split("\n")[1:]:
        line = line.split(",")
        # print(line[5][:-1])
        # print(line)
        # print(int(line[3]))
        if (int(line[4]) < int(line[5][:-1])): # 4 5
            class_list[int(line[3])-1].append(line[0])
    student_schedule = request.get_json("schedule")
    # print(class_list)
    added_course = request.get_json("added_course")
    dropped_course = request.get_json("dropped_course")
    # print(type(class_list))
    return jsonify({"message": "Success!"})



if __name__ == '__main__':
    app.run(debug=True)
    #test test
