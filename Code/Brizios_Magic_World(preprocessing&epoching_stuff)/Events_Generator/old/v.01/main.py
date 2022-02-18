# -*- coding: utf-8 -*-
"""
Created on Sat Jun  8 09:51:08 2019

@author: Fabrizio Zoleo
"""

from FileManager import FileManager as FM
from EventsGenerator import EventsGenerator as EG

path = input("Please insert the folder path containing the timestamps files for extracting events:\n")
print("\nPlease insert the name of the timestamp files.\nFiles must be in CSV or JSON format, but they cannot be both of the same format.")
f1 = input("\nFirst file name:\n")
f2 = input("\nSecond file name:\n")
fm = FM()
print("\n\nLoading data . . . ")
result = fm.loadData(path, f1, f2)
if result == 0:
    eg= EG(fm.getRounds(), fm.getBaseTstamp())
    answers_times = eg.getAnswersTimes()
    round_times = eg.getRoundsTimes()

    print("\n\nGenerating events file . . .")
    fm.generateEventsFile(round_times, answers_times)
    print("\n\nEvents generated in the file {} .".format(fm.getFileName() + "_events.txt"))
else:
    if result == -1:
        print("\nAn error has occurred while loading the files.")
    elif result == 1:
        print("\nFiles have the same format. Please select files with different formats.")
    elif result == 2:
        print("\nThe timestamps files must be respectively in CSV and JSON formats. Please check the files specified.")
    print("\nThe program will abort now . . .")