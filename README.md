# Webde
This project emulates a desktop environment in a browser. It has been developed from scratch using vanilla Javascript.

*This project has been created in 2009 to demonstrate what could be the future of the web (mainly web applications instead of websites) with bleeding edge features of Javascript at that time. It's now deprecated.*

The entry point of the project is the file `applications.xml` that contains the list of the available *applications*. From this file, a desktop environment is created. Every *application* specific code is in its own subfolder in the root `apps` folder. Some applications have been created to illustrate what can be done.

Here is the definition of an application:
```
<app id="video_player">
	<title>Video Player</title>
	<icon>images/icons/film.png</icon>
	<category>media</category>
	<description>Video player</description>
	<source>video_player.xml</source>
	<xaxis>600</xaxis>
	<yaxis>200</yaxis>
	<width>500</width>
	<height>300</height>
	<resizable>true</resizable>
</app>
```
