<div id="top"></div>

This is part of a real research project that resulted in the publication of the paper [Detecting the neural processes of lie generation with low-cost EEG: a preliminary study](./Garofalo_et_al_GNB_2020_paper_35.pdf).   
 <br />
This repo is messy. Many of the code snippets here are just drafts. It was not meant to be on github, but I'm uploading this to rehearse all those wonderful memories of working toghether with two great friends, Fabrizio and Francesco.  

Disclaimer: The dataset is the original one (except for a couple of missing subjects). All people names are fake and the data has been deidentified in respect of the privacy of all subjects.



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#tools">Methods and Tools</a></li>
    <li><a href="#preprocessing">Preprocessing</a></li>
    <li><a href="#eda">Exploratory Data Analysis</a></li>
    <li>
      <a href="#results">Results</a>
      <ul>
        <li><a href="#bio">Neuroscience</a></li>
        <li><a href="#ai">AI</a></li>
      </ul>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Lying and being deceptive is a common and costly behaviour among human beings which has been studied from different perspectives and with a range of different protocols, with the aim of bringing to light the physiological mechanisms accompanying lie generation. The goal of this preliminary study was to investigate the feasibility of lie detection using a portable low cost device (Muse 2016, InteraXon Inc.). The data coming from this exploratory has been fed to some ML algorithms with the purpose of automatically detect guilty individuals. The best accuracy so far has been around 71%

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- Methods -->
## Tools

A. Participants and settings
39 healthy subjects (age 17-62) with no history of mental disorder.
Environment settings included parks, university classrooms and private houses.
B. Experimental protocol
a. Before the experiment, participants were instructed to lie during a card game on a smartphone in
such a way that it would not have been possible to discover a secret card by simply analyzing the
behavioral responses.
b. A random card (probe) was shown to the subject who was asked to keep this card secret in memory.
c. A series of 39 random cards appeared on the screen; the subject was instructed to answer “Yes” or
“No” to the (implicit) question about the possible matching between the displayed card and the probe
card. As participants were asked to lie during the game, the suggested strategy was that they had to
press the button “No” when the secret card occurred (probe trial) and “Yes” when a different card,
freely chosen by them during the game, occurred (target trial). Otherwise, they had to press ”No”.
Probe and target cards randomly appeared more than once (min 1 max 4) during the experiment.

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- Preprocessing -->
## Preprocessing

The low cost device is the Muse headset (2016), with sampling rate of 256 Hz and five
electrodes (one reference electrode, AF7, AF8, TP9, TP10)
To stream the data from the headband, the Muse Direct application was running in background
on an Android smartphone, while, on the same device, the card game application was executed
in foreground.
Preprocessing and analysis with MATLAB’s toolbox EEGLAB.
Data were high pass filtered at 0.1 Hz and baseline corrected. Noise was removed at 50Hz.
Excessively noisy trials were then removed by visual inspection. Lastly, 4 seconds epochs time
locked to the stimulus presentation were extracted from single trials with 1 s of prestimulus
baseline.
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Exploratory Data Analysis -->
## EDA

The trials have been divided into two categories: Truth and Lie. All the trials in each of the
two groups have been averaged, baseline corrected and then compared by using a paired t-test
The most statistically significant results were obtained from the analysis of the electrode TP9. a positive peak is visible in the ERP response (500 ms), and a
subsequent negative peak (1000 ms). The black bars under the time axis denote statistically significant differences (p-value < 0.05 at window 500-600 ms and
900-1200 ms).
Response times for telling a lie are slower. This clarifies the presence of the significant statistical difference (900-1200 ms) as being the difference in response
times.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Results -->
## Results
### Neuroscience
Differences are located respectively around 300 ms, 500 ms, 1000 ms and cover the whole
alpha band (~7.5-15 Hz) and part of the low beta band. As lies almost certainly involve inhibitory
neural processes, the observed changes in the alpha synchronization, especially in the two later
time windows, could be related to the fact that alpha is often associated with inhibitory neural
processes. The time window around 300 ms, denotes a desynchronization response during the
process of lying, thereby, given also a slight trend towards lower frequencies (theta rhythm), this
is probably associated with the additional neural cost of telling a lie.
### IA

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#top">back to top</a>)</p>



