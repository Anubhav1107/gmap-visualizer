from email import header
from numpy import real
import pandas as pd
import os
from flask import jsonify

def processdata():
    # Loading and reading the CSV file.
    
    f = pd.read_csv('grid_2k.csv',encoding= 'unicode_escape')
    # Converting the CSV data to a list.
    df = f.to_dict(orient = 'records')
    return df

import mysql.connector as mc
# conn= mc.connect(host='127.0.0.1',user='root',password='password',db='bizom_data')
conn= mc.connect(host='eagleeye-sd.ckjulgq8jktj.ap-south-1.rds.amazonaws.com',user='anubhav.sinha',password='TP/TPNMe3bPdwfc@',port=3306,db='propertiesData')
c = conn.cursor()


def index(room,types,id):

    try:

        if (id=='all'):
    
            query_string = """SELECT r.Name, r.Latitude, r.Longitude,r.type FROM `Master_Property` r  where r.rooms = %s and r.type LIKE %s"""
            c.execute(query_string,(room,types,))
            data = c.fetchall()
            dat = pd.DataFrame.from_records(data,columns=['Name','Latitude','Longitude',"type"],index=None)
            # print(dat)
            # result_df = pd.concat([dat,result_df],axis=0)


            df = dat.to_dict(orient = 'records')
            print("query running ---------------------------->")
            
            # print(result_df)
            return df

        else:
            query_string = """SELECT r.Name, r.Latitude, r.Longitude,r.type FROM `Master_Property` r  where r.rooms = %s and r.type LIKE %s and r.gridid =%s"""
            c.execute(query_string,(room,types,id,))
            data = c.fetchall()
            dat = pd.DataFrame.from_records(data,columns=['Name','Latitude','Longitude',"type"],index=None)
            # print(dat)
            # result_df = pd.concat([dat,result_df],axis=0)


            df = dat.to_dict(orient = 'records')
            print("query running ---------------------------->")
            
            # print(result_df)
            return df

        
            

    except Exception as e:
        # e holds description of the error
        error_text = "<p>The error:<br>" + str(e) + "</p>"
        hed = '<h1>Something is broken.</h1>'
        return hed + error_text

# index(10000000,20000000,3,4,'Sarjapur','false','true','true')



def pgrid(lat,lng,id):
    if id==None:

        query_string = """SELECT gridid, minlatitude,maxlatitude,minlongitude,maxlongitude from `grid_2k` where (%s >= minlatitude) and (%s <= maxlatitude) and (%s >=minLongitude) and (%s <=maxLongitude)"""
        c.execute(query_string,(lat,lat,lng,lng,))
        data = c.fetchall()
        dat = pd.DataFrame.from_records(data,columns=['gridId','MinLatitude','MaxLatitude','MinLongitude','MaxLongitude'],index=None)
        dat = dat.to_dict(orient='records')
        print(dat)
        return dat
    else:
        query_string = """SELECT gridid, minlatitude,maxlatitude,minlongitude,maxlongitude from `grid_2k` where (%s == gridid) """
        c.execute(query_string,(id,))
        data = c.fetchall()
        dat = pd.DataFrame.from_records(data,columns=['gridId','MinLatitude','MaxLatitude','MinLongitude','MaxLongitude'],index=None)
        dat = dat.to_dict(orient='records')
        print(dat)
        return dat



#cases where grid is showing error
# pgrid(13.013390348646427, 77.58913989712786)   12.981435918616233 77.53568581333424





def touch(id):
    
    try:

        query_string= """select Grid, 1_Bhk, 2_Bhk, 3_Bhk ,Average_1Bhk, Average_2Bhk, Average_3Bhk,Locality_1Bhk,Locality_2Bhk,Locality_3Bhk from `average_rent_update` where Grid =%s """

        c.execute(query_string,(id,))

        data = c.fetchall()
        dat = pd.DataFrame.from_records(data,columns=["Grid", "1_Bhk", "2_Bhk", "3_Bhk" ,"Average_1Bhk", "Average_2Bhk", "Average_3Bhk","Locality_1Bhk","Locality_2Bhk","Locality_3Bhk"],index=None)
        # print(dat)
        # result_df = pd.concat([dat,result_df],axis=0)


        df = dat.to_dict(orient = 'records')
        print("query running ---------------------------->")
        
        # print(result_df)
        return df
    

    except Exception as e:
        # e holds description of the error
        error_text = "<p>The error:<br>" + str(e) + "</p>"
        hed = '<h1>Something is broken in Touch function.</h1>'
        return hed + error_text
