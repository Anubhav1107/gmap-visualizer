
from flask_cors import CORS
import pandas as pd
from flask import Flask, jsonify
from flask import request
from processdata import index, pgrid, processdata, touch



app = Flask(__name__)
CORS(app,expose_headers='Location')



@app.route('/db',methods=['GET','POST'])
def data(room=1,types='Rent',id=all):
    print(request.method)
    
    # start = request.args.get('start')
    # end = request.args.get('end')
    # first = request.args.get('first')
    # last = request.args.get('last')
    # locality =str('%') + request.args.get('locality')+str('%')
    # src1 = request.args.get('src1')
    # src2 = request.args.get('src2')
    # src3 = request.args.get('src3')
    room = request.args.get('room')
    types = request.args.get('type')
    id = request.args.get('id')


    result = index(room,types,id)
    
    return jsonify(result)



@app.route('/touch',methods=['GET','POST'])
def data2(id=1018):
    print(request.method)
    

    #removed all locality option, if require, add the location cause in processdata.py and add a parameter in all these functions.
    # start = request.args.get('start')
    # end = request.args.get('end')
    # first = request.args.get('first')
    # last = request.args.get('last')
    # # locality =str('%') + request.args.get('locality')+str('%')
    # src1 = request.args.get('src1')
    # src2 = request.args.get('src2')
    # src3 = request.args.get('src3')
    id = request.args.get('id')

    result = touch(id)
    
    return jsonify(result)



@app.route('/grid',methods=['GET','POST'])
def partgrid(lat=12.9716,lon=77.5946,id=None):
    
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    id = request.args.get('id')

    print(lat,lon)
    result = pgrid(lat,lon,id)
    print(result)
    return jsonify(result)




@app.route('/totalgrid')
def totalgrid():
    
    l = processdata()
    
    k  = jsonify(l)

    return k


if __name__ == '__main__':
    app.run(host = "localhost", debug = True, port = 3001)