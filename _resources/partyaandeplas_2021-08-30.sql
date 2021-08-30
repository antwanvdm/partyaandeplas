# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.4.17-MariaDB)
# Database: partyaandeplas
# Generation Time: 2021-08-30 18:28:02 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table player_question
# ------------------------------------------------------------

DROP TABLE IF EXISTS `player_question`;

CREATE TABLE `player_question` (
  `player_id` int(11) unsigned NOT NULL,
  `question_id` int(11) unsigned NOT NULL,
  `answer` tinyint(1) NOT NULL,
  `score` decimal(6,1) NOT NULL,
  `seconds` smallint(6) NOT NULL,
  PRIMARY KEY (`player_id`,`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table players
# ------------------------------------------------------------

DROP TABLE IF EXISTS `players`;

CREATE TABLE `players` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table questions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `questions`;

CREATE TABLE `questions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL DEFAULT '',
  `answer1` varchar(100) NOT NULL DEFAULT '',
  `answer2` varchar(100) NOT NULL DEFAULT '',
  `answer3` varchar(100) NOT NULL DEFAULT '',
  `answer4` varchar(100) NOT NULL DEFAULT '',
  `correct` tinyint(1) NOT NULL,
  `fact` text NOT NULL,
  `hidden` tinyint(1) NOT NULL,
  `lat` decimal(20,13) NOT NULL,
  `lon` decimal(20,13) NOT NULL,
  `location` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;

INSERT INTO `questions` (`id`, `title`, `answer1`, `answer2`, `answer3`, `answer4`, `correct`, `fact`, `hidden`, `lat`, `lon`, `location`)
VALUES
	(1,'Wat is Loans favoriete activiteit?','Spelen in het grote zwembad met de eendjes en de ballen','Poepen op de WC en heel trots roepen hoe groot zijn drol is','Eten van snijboontjes en die met de graafmachine van zijn bord naar zijn mond vervoeren','Heel actief klimmen in toestellen in de speeltuin, hoe hoger hoe beter',1,'Hoe trots Loan ook is op zijn WC kunsten, er gaat niets boven waterpret! Of het nu strand, balkon, douche of het grote zwembad is, hij kan hier uren zoet zijn en is altijd weer teleurgesteld als hij er weer uit moet.',0,51.9386899702057,4.5073097473873,'Peuterbad'),
	(2,'In welk jaar ontmoette Antwan en Iris elkaar voor het eerst, en in welk jaar kwamen ze uiteindelijk samen?','2008, 2016','2009, 2016','2008, 2017','2009, 2017',2,'Antwan startte zijn stage bij DPDK in september 2009. Tijdens de borrel op 4 september kwam het eerste moment waarop ze elkaar een hand hebben geschud. De vonk sloeg overigens pas over in 2013, en het duurde nog tot 2016 voor ze eindelijk samen kwamen.',0,51.9374658994979,4.5057278360294,'Openbaar toilet'),
	(3,'Welke vooropleiding (MBO) heeft Antwan afgerond voordat hij naar het HBO ging?','Multimedia Vormgever','ICT beheer','Applicatiebeheer','Grafisch Vormgever',1,'Van 2003 t/m 2007 volgde Antwan de opleiding Multimedia Vormgever op het Zoomvliet College in Roosendaal. Zijn begeleider tijdens zijn eerste stage heeft hem overtuigd dat een HBO noodzakelijk was om echt goed te groeien. Zonder die overtuiging had Antwan nu nooit lesgegeven op zijn, inmiddels 10 jaar geleden afgeronde, HBO opleiding...',0,51.9396606221612,4.5050632248781,'Kinderboerderij'),
	(4,'Met welke muziek kun je Iris op elk moment van de dag blij maken?','Kensington','Tim Akkerman','Alain Clark','Waylon',4,'Of het nu zijn uiterlijk is, zijn zwoele stem, of zijn achtergrondverhalen, Iris zal erbij weg zwijmelen. Geen slecht woord over Waylon want ze zingt zijn nummers vol passie mee en gaat meerdere concerten van hem af. Ook leuk: In 2010 zagen Iris en Antwan tijdens een DPDK uitje Waylon live tijdens het \"The Hague Jazz\" festival.',0,51.9365364390735,4.5084563454518,'Uitkijktoren'),
	(5,'Welke uitspraak gebruiken Loan en Antwan wanneer ze een doelpunt maken tijdens het voetballen?','Goal!','Raaaaak!','Golazo!','Boem!',3,'Antwan is fan van voetbalcommentator Sierd de Vos. De Vos kan enkel gehaat of geliefd zijn gezien zijn constante restaurant tips, beledigingen van voetballers en heerlijke bevliegingen tijdens acties en doelpunten. Bekende kreten zijn \"Ratatatatata\", \"Op de brommer\", \"Koekoek\", en het hard schreeuwen van \"Golazooooo\" bij een doelpunt. Ondertussen schreeuwt Loan dit bijna harder op de veldjes in Rotterdam :)',0,51.9380883608130,4.5031840871664,'Hoekje van het veld'),
	(6,'Welke wereldberoemde band trad in 1970 op tijdens het Holland Pop Festival in het Kralingse bos?','The Beatles','Santana','Led Zeppelin','The Who',2,'Het bos verwerft grote bekendheid in de zomer van 1970 vanwege het Holland Pop Festival, het \'Europese antwoord op Woodstock\'. Internationale bands die er optreden zijn onder meer Pink Floyd, The Byrds, Santana en Focus. In totaal zijn er meer dan 100.000 bezoekers.',1,51.9392662161923,4.5072133330043,'Public toilet'),
	(7,'Wat was de eerste reisbestemming waar Iris en Antwan samen zijn geweest?','Kefalonia','Napoli','Gambia','Lanzarote',3,'Alle benoemde locaties zijn inderdaad bezocht door Iris & Antwan. Napoli was de eerste stedentrip, en Gambia was de eerste vakantie samen. Grappig feitje: Antwan zou eerst alleen naar Gambia gaan maar toen ze samen kwamen heeft een last-minute omboeking er een romantisch tripje van gemaakt.',1,51.9390675936635,4.5030250081212,'Random plek'),
	(8,'In welke jaar was de officiële opening van het Kralingse Bos?','1925','1911','1921','1953',4,'Het plan voor de aanleg van het stadspark werd in 1911 aangenomen door de gemeenteraad van Rotterdam. Het plan werd niet direct uitgevoerd. In 1921 maakte Marinus Jan Granpré Molière een nieuw ontwerp. Men werkte jarenlang aan het Kralingse Bos. De officiële opening was pas in 1953.',0,51.9406039744461,4.5052518324233,'Grote speeltuin');

/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
