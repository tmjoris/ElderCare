# Elderly Care Application

An application to manage the medical histories and files of elderly people, designed to be an intermediary used by multiple facilities.

[Server documentation](./doc)
[Client Documentation](./ElderCareClient/README.md)

# RUNNING THE APPLICATION

Make sure you have NodeJs installed
**On Windows**
<pre>winget install -e --id OpenJS.NodeJs</pre>

# **THE FRONTEND**
Navigate to the ElderCare Client
<pre>cd ElderCareClient</pre>

Make sure you have NodeJS installed then install all the project's dependecies
<pre>npm i</pre>

Each time you want to run the project run
<pre>npm start</pre>

# **THE BACKEND**

Make sure you have gradle version 7 or later versions and springboot installed then navigate to the ElderCareServer directory
<pre>cd ElderCareServer</pre>


And run
<pre>gradle wrapper</pre>


If gradlew is not executable, you may need to set the proper permissions:


Use the gradlew script to execute Gradle commands
<pre>./gradlew build</pre>


ONCE YOU HAVE BUILT GRADLE YOU DON'T NEED TO REPEAT IT


RUN THE SPRINGBOOT APP
<pre>./gradlew bootRun</pre>
