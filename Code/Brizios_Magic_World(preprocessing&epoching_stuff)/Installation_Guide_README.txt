- - - - - - FRAMEWORK SETUP - - - - - - 
First of all, be sure to have MATLAB installed on your PC together with EEGLAB. If you haven't installed yet, you can download them from:
- MATLAB (v. R2019a) 	https://www.mathworks.com/downloads/
- EEGLAB (v. 14_1_2b) 	https://sccn.ucsd.edu/eeglab/download.php

Once they are installed and correctly set for working, be sure to install the following plugins in EEGLAB (File -> Manage EEGLAB extensions):
- select "Data import extensions" and search for the "musemonitor" plugin, then check it and click "OK" to install;
- select "Data Processing extensions" and search for the "Cleanline", "clean_rawdata" and "firfilt" plugins, then check them and click "OK" to install.

Now your framework has all that is needed to apply the pre-processing pipeline to data recorded with the MuseMonitor app.


- - - - - - PYTHON ENVIRONMENT SETUP - - - - - - 
Be sure you have installed Python 3.7.3 on your computer. If you haven't installed yet, you can download it from the official page of Python:
https://www.python.org/downloads/

After the installation, update the SYSTEM ENVIRONMENT VARIABLES:
1) Go on the "Properties" of "My Computer", then select "Advanced System settings"
2) Click on "Environment Variables"
3) In the bottom box, search for the PATH variable and double-click on it
4) Be sure that the Python installation folder and Python\Scripts folder are listed, otherwise add them 
5) Be sure that the MATLAB installation folder is listed, otherwise add it

Now the system environment should be set up; to check it, open the Terminal and run the command "python": you should see the version of python
installed. Press CTRL+Z to quit from Python.

The next step is to install all the packages and libraries needed in Python:
1) Open the Terminal as Administrator and run the following commands:
	-   python -m pip install pandas 	(Pandas and Numpy libraries installation)
	-   python -m pip install matlab_kernel  (MATLAB kernel for Python)
2) In the terminal, move to the MATLAB installation folder (es. C:\Program Files\MATLAB\R2019a)
3) Move to the subfolder "extern\engines\python"
4) Run the following command:
	-   py setup.py install --prefix="PythonInstallDirectory"  (Insert the path of Python installation directory, this is only a placeholder)

Now you should have all set up for running the pre-processing application!


- - - - - - APPLICATION SETUP AND INSTRUCTIONS- - - - - - 
1) Extract the archive in the folder that you prefer
2) Open the Terminal and move to the folder in which files was extracted
3) Modify the file "config.json" and put the path of the electrodes locations standard to be used during the pre-processing 
   (it should be in the eeglab/plugins/dipfit3.0/standard_BEM/elec folder, the file is "standard_1005.elc")
4) Run "automated_preprocessing.py" to process data in all rounds for a subject
5) Run "component_analyzer.py" to inspect processed raw data, computed components and their spectra; eventually, you can specify the components
   to be rejected from data and see the results. After the inspection of a single round, the program will extract target and not-target epochs.

In order to run the application correctly, keep in mind that the "automated_preprocessing.py" script will work on a well-structured hierarchy of
folders, that should be organized as following:

- SubjectName
	- R01
	- R02
	   .
	   .
	   .
	- RN

Each subfolder in the "SubjectName" folder should correspond to a single Round and must contain at least the CSV file recorded with the MuseMonitor app and the 
JSON file containing the timestamps recorded during the experiment. 
Round folders must have the name "RN" or "ROUNDN" (case non-sensitive), where "N" is the number of the round on at least two digits. 
Example:
 	Round num. 1 -> "R01" or "ROUND01"  

Round subfolders CANNOT be put in other subfolders under the "SubjectName" folder!!

If you want to create alternative processing folders, create the folder and put there all the SubjectFolders, each one containing its Round folders;
in this case, the working folder requested from the applications must be the alternative folder containing all the subjects subfolders because the 
applications will search the rounds there.
Example:

-Alternative_1
  	- SubjectName1
		- R01
		- R02
	  	 .
	   	 .
  	- SubjectName2
		- R01
		- R02
	 	  .
	 	  .

-Alternative_2
  	- SubjectName1
		- R01
		- R02
	  	 .
	   	 .
  	- SubjectName2
		- R01
		- R02
	  	 .
	   	 .

Working path provided to the application: "...\Alternative_1\SubjectName1\" to process rounds of Subject1 in Alternative_1.


Finally, the three applications will ask some parameters in input, but some of them can be provided from command line as arguments when running the command 
for executing the applications. The arguments you can provide from command line are the following:
- "automated_preprocessing.py" -> 1^ arg: WORKING_PATH 
- "component_analyzer.py" -> 1^ arg: WORKING_PATH ;  2^ arg: HIGH-PASS_FILTER_FREQUENCY with which the first pre-processing pass has been performed
- "automated_epocazzo.py" -> 1^ arg: WORKING_PATH;   2^ arg: name of pre-processing STEP on which epochs must be extracted.

The command line arguments are not mandatory: if not provided, they will be requested from the application. For the "component_analyzer.py" application you can 
specify either both arguments or only the first one, but you cannot specify the second argument without the first one.

For the pre-processing STEP argument, remember that after each processing step a new dataset is created and the name of the last step 
executed is appended to the dataset name; so that, you must specify the name of the last processing step for processing that particular
dataset, or you can enter the name of the subject if you want to work on the very raw dataset without any processing step executed on it.

Example:
You want to work on the dataset processed until the Cleanline step, so you must specify the step-name: "cleanline". The following dataset
will be considered: "SubjectName_hpf1.5_cleanline.set" , "SubjectName_hpf0.5_cleanline.set"
