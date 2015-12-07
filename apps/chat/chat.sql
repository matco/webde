CREATE TABLE IF NOT EXISTS chat (
	id int(5) NOT NULL AUTO_INCREMENT,
	pseudo varchar(32) NOT NULL,
	message varchar(255) DEFAULT NULL,
	time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ip varchar(15) DEFAULT NULL,
	PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;