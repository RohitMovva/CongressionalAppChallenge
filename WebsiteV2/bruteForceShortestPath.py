from flask import Flask, jsonify, request
from flask_cors import CORS  # <-- Import CORS
import sys
app = Flask(__name__)
CORS(app)

new_schedule = []
def shortestPath(classes, schedule, original_schedule):
    n = len(schedule)
    if (n == 0):
        return 0
    
    lowval = sys.maxint
    chosen_index = -1
    chosen_period = -1
    # i = 8-n
    new_schedule.push_back("-1")
    for i in range(0, n):
        for j in range (0, len(classes[i])):
            if ([classes[i][j]] == schedule[0]):
                print("alr it's recursion time!")
                lowval = min(lowval, shortestPath(classes, schedule[1:]))
                new_schedule[i] = classes[i][j]
                chosen_index = j
                chosen_period = i
                print("gotta keep going!")


    if (original_schedule[chosen_period] != classes[chosen_period][chosen_index]):
        lowval += 1

    return lowval

def getPath(classes, schedule, added_class, dropped_class):
    new_schedule = []
    schedule[schedule.index(dropped_class)] = added_class
    shortestPath(classes, schedule, schedule)
    print("HEYO")
    print(new_schedule)