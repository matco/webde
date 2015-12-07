<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="UTF-8" doctype-public="-//W3C//DTD XHTML 1.1//EN" doctype-system="http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd" indent="yes" />

	<!--parametres-->
	<!--<xsl:param name=""></xsl:param> -->

	<xsl:template match="/">
		<div><xsl:value-of select="/rss/channel/title"/>
			<ul>
				<xsl:apply-templates select="/rss/channel/item"/>
			</ul>
		</div>
	</xsl:template>

	<!--template pour les items -->
	<xsl:template match="/rss/channel/item">
		<li>
			<a href="{link}"><xsl:value-of select="title"/></a>
			
		</li>
	</xsl:template>

</xsl:stylesheet>