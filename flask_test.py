from flask import Flask, jsonify, request
from flask_cors import CORS  # <-- Import CORS

app = Flask(__name__)
CORS(app)  # <-- Enable CORS for the app

@app.route('/')
def hello():
    return "Hello, World!"

@app.route('/api/greet', methods=['POST'])
def greet_user():
    data = request.get_json()
    print(type(data))
    print(data)
    name = data.get("username", "Guest")
    classes = []
    for i in name.split("\n")[1:]:
        print("adding...\n")
        classes.append(i.split(',')[0])
    print(classes)
    f = open('class_list.csv','w', newline='')
    f.write(name)
    f.close()
    # 
    return jsonify({"message": "Success!", "class_list": classes})

if __name__ == '__main__':
    app.run(debug=True)
    #test test
