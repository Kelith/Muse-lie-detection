# -*- coding: utf-8 -*-
"""
Created on Sat Jun  8 09:55:20 2019

@author: Fabrizio Zoleo
"""
#import os
import pandas as pd
import json
from json import JSONDecodeError

class FileManager:
   
    def __init__(self):
        self.data_csv = None
        self.data_json = None
        self.file_name = ""
        self.answers_tstamps = []
    
    def loadData (self,  path, f1, f2):
        # Loading CSV file as DataFrame object
        self.file_name = path + "/" + f1[: f1.find('.')]
        files = [f1, f2]
        result = -1
        if (self.__isCSV(f1) and self.__isCSV(f2)) or (self.__isJSON(f1) and self.__isJSON(f2)):
            result = 1
        else:
            for f in files:
                try:
                    fp = open(path + "/" + f)
                    if self.__isCSV(f):
                        cols = fp.readline().strip().split(',')
                        cols.pop()
                        base_tstamp = fp.readline().strip().split(',')
                        print(cols)
                        print(base_tstamp)
                        self.data_csv = pd.DataFrame(data=[base_tstamp], columns=cols)
                        print(self.data_csv)
                    elif self.__isJSON(f):
                        self.data_json = json.load(fp)
                    else:
                        return 2
                        
                except IOError:
                    print("\nAn error has occurred while opening the file '{}'".format(f))
                    result = -1
                except JSONDecodeError:
                    print("\nThe file is not valid.")
                    result = -1
                except ValueError:
                    print("\nError while loading data.")
                    result = -1
                fp.close()
            result = 0
        return result
       # self.data_csv = self.data_csv[ self.data_csv['TimeStamp'] < "2019-06-06 18:32:00.000"]
        
    def __isCSV(self, fname):
        return fname[fname.find('.')+1 :].upper() == "CSV"
    
    def __isJSON(self, fname):
        return fname[fname.find('.')+1 :].upper() == "JSON"
        
    def generateEventsFile(self, round_times, answer_times):
        fp = open(self.file_name + "_events.txt", 'w')
        fp.write("Latency\tType\n")
        
        for r in round_times:
            line = "" + str(r) + "\tnew-round"
            fp.write(line + "\n")
        
        for a in answer_times:
            line = "" + str(a[2]) + "\tstart-question"
            fp.write(line + "\n")
                
            line = "" + str(a[3]) + "\tstart-answer"
            fp.write(line + "\n")
            
            line = "" + str(a[4]) + "\tanswer-click"
            
            if bool(a[1]):
                line += "-isTarget"
            elif bool(a[0]):
                line +="-isYes"
            else:
                line += "-notTarget"
            
            
                
            fp.write(line + "\n")
            
            line = "" + str(a[5]) + "\tend-answer"
            fp.write(line + "\n")
        
        fp.close()
        
    # Getter and Setter
    def getRounds(self):
        return self.data_json['rounds']
    
    def getBaseTstamp(self):
        if self.data_csv.size > 0:
            return self.data_csv.loc[0, 'TimeStamp']
        else:
            return ""
        
    def getFileCSV(self):
        return self.data_csv
    
    def setFileCSV(self, df):
        if type(df) == type(pd.DataFrame):
            self.data_csv = df
            
    def getFileJSON(self):
        return self.data_json
    
    def setFileJSON(self, f):
        self.data_json = f
    
    def getFileName(self):
        return self.file_name