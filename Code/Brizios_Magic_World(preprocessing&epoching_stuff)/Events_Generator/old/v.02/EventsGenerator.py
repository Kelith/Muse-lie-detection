# -*- coding: utf-8 -*-
"""
Created on Sat Jun  8 09:53:43 2019

@author: Fabrizio Zoleo
"""
from datetime import datetime as dt

class EventsGenerator:
   
    def __init__(self, rounds, base_tstamp):
        self.rounds = rounds
        self.base_tstamp = base_tstamp
        self.answers_times = []
        self.round_times = []
        print("\n\nConverting Base_TimeStamp . . .")
        self.__base_tStampConversion()
        print("\n\nConverting JSON . . .")
        self.__JSON_tStampConversion()
        
        
    def __base_tStampConversion(self) :
        tstamp = self.base_tstamp
        if tstamp.find('.') == -1:
            tstamp = self.base_tstamp + ".000"
            print("Base Timestamp: {}\t-->\t{}".format(self.base_tstamp, tstamp))
        tstamp = dt.strptime(tstamp, '%Y-%m-%d %H:%M:%S.%f')
        self.base_tstamp = dt.timestamp(tstamp)
            
        
    def __JSON_tStampConversion(self):        
        for r in self.rounds:
            for a in r['answersArray']:
                a['questionStartingTimeInMillis'] = a['questionStartingTimeInMillis'] / 1000
                a['startWindowTimestamp'] = a['startWindowTimestamp'] / 1000
                a['answerTimestamp'] = a['answerTimestamp'] / 1000
                a['endingWindowTimestamp'] = a['endingWindowTimestamp'] / 1000
    
    def getAnswersTimes(self):
        if len(self.answers_times) == 0:
            for r in self.rounds:
                for a in r['answersArray']:
                    question_start = round(a['questionStartingTimeInMillis'] - self.base_tstamp, 3)
                    answer_start = round(a['startWindowTimestamp'] - self.base_tstamp, 3)
                    answer_time = round(a['answerTimestamp'] - self.base_tstamp, 3)
                    answer_end = round(a['endingWindowTimestamp'] - self.base_tstamp, 3)
                    self.answers_times.append( (a['isYes'], a['isTarget'], question_start, answer_start, answer_time, answer_end) )
                
        return self.answers_times
    
    def getRoundsTimes(self):
        if len(self.round_times) == 0:
            for r in self.rounds:
                round_start = round(r['answersArray'][0]['questionStartingTimeInMillis'] - self.base_tstamp - 1, 3)
                self.round_times.append(round_start)
        
        return self.round_times
    
    #Getter and Setter
    def getBaseTstamp(self):
        return self.base_tstamp
    
    def getRounds(self):
        return self.rounds
    
    # DEPRECATED
    def insertQuestionStartTstamp(self, df):
        current_answer = 0
        last_diff = 100000
        last_index = -1
        print("Answers:\n{}\n".format(self.answer_tstamp))
        for i,t in enumerate(self.csv_tstamps):
            print("CSV_tstamp: {}\t{}".format(i,t))
            current_diff = self.answer_tstamp[current_answer][0] - t
            print("Answer_tstamp: {}\t Diff: {}".format(self.answer_tstamp[current_answer][0], current_diff))
            print("Last_diff: {}\tLast_index: {}".format(last_diff,last_index))
            if current_diff >= 0 and current_diff <= last_diff:
                last_diff = current_diff
                last_index = i
                print("New values!")
            elif current_diff < 0:
                print("Inserting row . . .")
                self.__insertRow(last_index-1)
                current_answer += 1
                if current_answer > len(self.answer_tstamp)-1:
                    break
                print("New answer:\n{}".format(self.answer_tstamp[current_answer]))