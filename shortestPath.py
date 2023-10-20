from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import dijkstra
import csv
import numpy as np

def dijkstras():
    class_list = []
    f = open("class_list.csv")
    for row in csv.reader(f):
        if (row[0] == "Class Name"):
            continue
        class_list.append([int(i) for i in row[3:]])
    s = len(class_list)
    graph = [[0 for j in range(s)] for i in range(s)]
    print(graph)
    for i in class_list:
        graph.push_back([0 for j in i])
        for j in range(0, len(i)):
            if (class_list[i][j] == 1):
                pass
    np.where(graph == 1)

    print(class_list)
    # graph = [
    # [0, 1, 2, 0],
    # [0, 0, 0, 1],
    # [0, 0, 0, 3],
    # [0, 0, 0, 0]
    # ]


    # graph = csr_matrix(class_list)

    # print(graph)
    # dist_matrix = dijkstra(csgraph=graph, directed=False, indices=[1], return_predecessors=False)
    # print(dist_matrix[2])

def algo_thingy():
    pass

dijkstras()