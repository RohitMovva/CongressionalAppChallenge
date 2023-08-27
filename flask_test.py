from flask import Flask, jsonify, request
from flask_cors import CORS  # <-- Import CORS
import csv
import random

app = Flask(__name__)
CORS(app)  # <-- Enable CORS for the app

def score(generation):
    score = 0
    return score

def uniform_crossover(parenta, parentb):
    pass

def solve():
    # class_list = list(csv.reader(open("class_instances.csv")))
    class_list = {}
    f = open("class_list.csv")
    for row in csv.reader(f):
        class_list[row[0]] = row[1:]
    # print(class_list)
    student_requests = list(csv.reader(open("student_course_requests.csv")))
    generation_size = 1 # 100
    generations = 1 # 100
    cross_over_rate = .9
    elitism = .1
    mutation_rate = .05
    for i in range(0, generations): # for 100 generations
        generation = [] # current generation
        for j in range(generation_size): # for each member of a generation
            generation.append([]) # new member of generation
            random.shuffle(student_requests[1:]) # shuffle students to keep it random, oh yeaaaaaaaah
            for k in range(1, len(student_requests)): # for each student in a member of a generation
                generation[j].append([]) # new student in a member
                available_periods = [True]*4
                for l in range(1, len(student_requests[k])): # for each course that student requested
                    generation[j][k-1].append([student_requests[k][l], -1])
                    print(generation[j][k-1][l-1])
                    print(student_requests[k], "aaaa")
                    for m in range(2, len(class_list[student_requests[k][l]])): # for each period
                        print(class_list[student_requests[k][l]][m] + " <-this")
                        if int(class_list[student_requests[k][l]][m]) > -1 and int(class_list[student_requests[k][l]][m]) < int(class_list[student_requests[k][l]][1])\
                              and available_periods[m-2]: # can they fit into that period
                            print(class_list[student_requests[k][l]][m])
                            class_list[student_requests[k][l]][m] = str(int(class_list[student_requests[k][l]][m]) + 1) # period now has another student, add 1 to count
                            generation[j][k-1][l-1][1] = m-1 # add new class period to the tuple
                            available_periods[m-2] = False
                            break

    print(generation)
@app.route('/')
def hello():
    return "Hello, World!"

@app.route('/api/greet', methods=['POST'])
def greet_user():
    data = request.get_json()
    name = data.get("username", "Guest")
    print(type(name))
    # with open('class_list.csv','wb') as file:
    #     # for line in name:
    #     file.write(name)
    #     file.write('\n')
    f = open('class_list.csv','w', newline='')
    f.write(name)
    f.close()
    return jsonify({"message": "Success!"})

if __name__ == '__main__':
    solve()
    app.run(debug=True)
    