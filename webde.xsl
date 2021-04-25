<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
	version="1.0"
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output
	method="html"
	encoding="utf-8"
	version="1.0"
	omit-xml-declaration="yes"
	doctype-public="-//W3C//DTD XHTML 1.1//EN"
	doctype-system="http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"
	indent="yes"
	media-type="application/xhtml+xml" />

	<!--parametres-->
	<!--<xsl:param name=""></xsl:param> -->

	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
			<head>
				<title>Webde</title>
				<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
				<!--css inclusion-->
				<link rel="stylesheet" type="text/css" href="webde.css" />
				<!--javascript classes inclusion-->
				<script type="text/javascript" src="js/classes/Autocomplete.class.js"></script>
				<script type="text/javascript" src="js/classes/ScreenSaver.class.js"></script>
				<script type="text/javascript" src="js/classes/Modal.class.js"></script>
				<script type="text/javascript" src="js/classes/Notification.class.js"></script>
				<script type="text/javascript" src="js/classes/Slider.class.js"></script>
				<script type="text/javascript" src="js/classes/DragDrop.class.js"></script>
				<script type="text/javascript" src="js/classes/Resize.class.js"></script>
				<script type="text/javascript" src="js/classes/Tooltip.class.js"></script>
				<script type="text/javascript" src="js/classes/DateTime.class.js"></script>
				<!--javascript scripts inclusion-->
				<script type="text/javascript" src="js/scripts/effets.script.js"></script>
				<script type="text/javascript" src="js/scripts/requete.script.js"></script>
				<script type="text/javascript" src="webde.js"></script>
			</head>
			<body>
				<div id="notification"></div>
				<div id="desktop">
					<!--menu-->
					<ul id="menubar">
						<!--windows menu-->
						<xsl:apply-templates select="/space/menus/menu"/>
						<!--search field-->
						<li style="width: 150px;">
							<input id="search" type="search" placeholder="Search" size="14" value="" autocomplete="off" />
							<ul id="search-results" class="submenu" style="min-width: 150px;"></ul>
						</li>
						<!--date and time-->
						<li style="float: right;">
							<span id="time" tooltip="date">00:00:00</span>
							<p id="date" class="tooltip"></p>
						</li>
						<!--title-->
						<li style="float: right; width: 150px;">
							<span id="title" tooltip="title-infos"></span>
							<p id="title-infos" class="tooltip"></p>
						</li>
						<!--logout-->
						<li style="float: right; width: 50px;">
							<img id="logout" tooltip="logout-infos" src="images/close.png" style="margin: 2px 5px;" />
							<p id="logout-infos" class="tooltip">Click to logout</p>
						</li>
						<!--user-->
						<li style="float: right; width: 150px;">
							<span id="user"></span>
						</li>
						<!--options-->
						<li style="float: right;">
							<span id="options-menu" tooltip="options-menu-infos">Options</span>
							<p id="options-menu-infos" class="tooltip">Desktop configuration</p>
						</li>
					</ul>

					<!--taskbar-->
					<ul id="taskbar">
						<li>
							<span id="minimize-all" tooltip="minimize-infos">Minimize</span>
							<p id="minimize-infos" class="tooltip">Minimize all windows</p>
						</li>
					</ul>

					<!--contextual menu-->
					<div id="contextual" style="width: 15em;">
						<ul id="contextual-list" class="submenu"></ul>
					</div>

					<!--loading-->
					<img id="loading" src="images/loading.png" />

					<!--thumbnails container-->
					<div id="thumbnails"></div>

					<!--windows-->
					<xsl:apply-templates select="/space/apps/app" mode="space"/>
				</div>

				<!--login-->
				<div id="login" style="background-color: #f5f5ff;">
					<h2>Login</h2>
					<div class="content">
						<form id="login-form" style="text-align: center;">
							<label>Username : <input name="username" type="text" size="15" autocomplete="off" /></label>
							<span id="login-error" style="margin-left: 15px; color: red;"></span>
							<br />
							<input type="submit" value="Login" />
						</form>
					</div>
				</div>

				<!--options-->
				<div id="options" style="background-color: #f5f5ff;">
					<h2>
						Options
						<img id="options-close" src="images/close.png" class="minibutton" />
					</h2>
					<div class="content">
						<form id="options-form">
							<h3>Screen saver time</h3>
							<label for="timer" style="float: left;">Timer:</label>
							<div id="timer-slider" style="float: left; margin-left: 10px; margin-top: 4px;"></div>
							<div style="float: left; margin-left: 10px;">
								<input name="timer" type="text" size="2" />
								<span style="margin-left: 5px;">minutes</span>
							</div>
							<h3 style="clear: both; margin-top: 40px;">Colors</h3>
							<label>Main color: <input name="color" type="text" size="8" /></label>
							<span style="margin-left: 5px;">HTML Format (#45eabb or white)</span>
							<br />
							<p style="text-align: right; padding-bottom: 0; margin-bottom: 0;">
								<input type="submit" value="Save" style="margin-right: 10px;" />
								<button type="button" id="options-cancel">Cancel</button>
							</p>
						</form>
					</div>
				</div>
				<!--<script type="text/javascript">
					var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
					document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
				</script>
				<script type="text/javascript">
					try{
						var pageTracker = _gat._getTracker('UA-12949789-1');
						pageTracker._trackPageview();
					} catch(err) {}
				</script>-->
			</body>
		</html>
	</xsl:template>

	<!--menu template-->
	<xsl:template match="menu">
		<xsl:variable name="category" select="@id"/>
		<li menu="{$category}" class="menu">
			<span tooltip="{concat(@id,'-tooltip')}"><xsl:value-of select="."/></span>
			<ul id="{$category}" class="submenu">
				<xsl:for-each select="/space/apps/app[category=$category]">
					<li link="{@id}" tooltip="{concat(@id,'-description')}">
						<img src="{icon}" style="padding: 5px;" />
						<xsl:value-of select="title"/>
					</li>
					<p id="{concat(@id,'-description')}" class="tooltip"><xsl:value-of select="description"/></p>
				</xsl:for-each>
			</ul>
			<p id="{concat(@id,'-tooltip')}" class="tooltip"><xsl:value-of select="concat(count(/space/apps/app[category=$category]),' item(s)')"/></p>
		</li>
	</xsl:template>

	<!--app template-->
	<xsl:template match="app" mode="space">
		<div id="{@id}" class="window" style="{concat('left: ',xaxis,'px; top: ',yaxis,'px; width: ',width,'px; height: ',height,'px;')}">
			<h2>
				<img src="{icon}" class="minibutton" style="float: left; margin: 0 10px 0 0;" />
				<xsl:value-of select="title"/>
				<img src="images/close.png" class="minibutton" />
				<img src="images/minimize.png" class="minibutton" />
				<img src="images/fold.png" class="minibutton" />
				<img src="images/loading.png" class="minibutton" style="height: 15px; display: none;" />
			</h2>
			<div class="content">
				<xsl:copy-of select="content"/>
			</div>
		</div>
	</xsl:template>
</xsl:stylesheet>