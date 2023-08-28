import random
import csv


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
    generation_size = 1  # 100
    generations = 1  # 100
    cross_over_rate = .9
    elitism = .1
    mutation_rate = .05
    # Generate first generation:
    generation = []  # current generation
    for i in range(generation_size):  # for each member of a generation
        generation.append([])  # new member of generation
        random.shuffle(student_requests[1:])  # shuffle students to keep it random, oh yeaaaaaaaah
        for j in range(1, len(student_requests)):  # for each student in a member of a generation
            generation[i].append([student_requests[j][0]])  # new student in a member
            available_periods = [True] * 4
            for k in range(1, len(student_requests[j])):  # for each course that student requested
                generation[i][j - 1].append([student_requests[j][k], -1])
                for l in range(2, len(class_list[student_requests[j][k]])):  # for each period
                    if int(class_list[student_requests[j][k]][l]) > -1 and int(
                            class_list[student_requests[j][k]][l]) < int(class_list[student_requests[j][k]][1]) \
                            and available_periods[l - 2]:  # can they fit into that period
                        class_list[student_requests[j][k]][l] = str(int(class_list[student_requests[j][k]][l]) + 1)  # period now has another student, add 1 to count
                        generation[i][j - 1][k][1] = l - 1  # add new class period to the tuple
                        available_periods[l - 2] = False
                        break

    print(generation)

# if __name__ == "main":
solve()
