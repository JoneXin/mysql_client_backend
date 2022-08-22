CREATE DATABASE `dddd` /*!40100 DEFAULT CHARACTER SET utf8 */;
use dddd; 

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `flaw`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `flaw` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) unsigned DEFAULT NULL,
  `panel_id` varchar(128) DEFAULT NULL,
  `panel_table_uid` int(11) DEFAULT NULL,
  `center_pos_md` decimal(16,3) DEFAULT NULL,
  `center_pos_cd` decimal(16,3) DEFAULT NULL,
  `length_md` decimal(16,3) DEFAULT NULL,
  `length_cd` decimal(16,3) DEFAULT NULL,
  `contours` mediumtext COMMENT '坐标集，用于缺陷描点',
  `gen_time` bigint(20) DEFAULT NULL,
  `gen_time_str` varchar(64) DEFAULT NULL,
  `save_path` varchar(256) DEFAULT NULL COMMENT '保存图片路径',
  `ui_show_text` varchar(16) DEFAULT NULL COMMENT '显示的名称（字母）',
  `area` decimal(16,3) DEFAULT NULL,
  `diameter` decimal(16,3) DEFAULT NULL,
  `camera_id` int(11) DEFAULT NULL,
  `flaw_class_type` varchar(128) DEFAULT NULL,
  `lot_id` varchar(40) DEFAULT NULL,
  `show` varchar(255) DEFAULT NULL COMMENT '缺陷的名称，中文',
  `ex_info` mediumtext,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `panel_id` (`panel_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2716 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

