import sys

new_schedule = []
def shortestPath(classes, schedule, original_schedule):
    n = len(schedule)
    if (n == 0):
        return 0
    
    lowval = sys.maxint
    chosen_index = -1
    # i = 8-n
    new_schedule.push_back("-1")
    for i in range(8-n, -1, -1):
        for j in range (0, len(classes[i])):
            if ([classes[i][j]] == schedule[0]):
                lowval = min(lowval, shortestPath(classes, schedule[1:]))
                new_schedule[i] = classes[i][j]
                chosen_index = j

    if (original_schedule[j] != -1 and original_schedule[j] != classes[i][j]):
        lowval += 1

    return lowval

def getPath(classes, schedule, added_class, dropped_class):
    schedule[schedule.index(dropped_class)] = added_class
    shortestPath(classes, schedule, schedule)