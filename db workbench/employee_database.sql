-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: leave_management
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement` (
  `announcement_id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`announcement_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
INSERT INTO `announcement` VALUES (10,'Vacation Leave Increased!!','Vacation leave has been increased by 2 days','2025-10-15 10:22:49','2025-10-15 10:23:16');
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employee_id` varchar(10) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `designation` varchar(30) NOT NULL,
  `email` varchar(45) NOT NULL,
  `department` varchar(25) DEFAULT NULL,
  `phone_no` varchar(25) NOT NULL,
  `manager_id` varchar(10) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `phone_no_UNIQUE` (`phone_no`),
  KEY `manager_id_idx` (`manager_id`),
  CONSTRAINT `fk_employee_manager` FOREIGN KEY (`manager_id`) REFERENCES `employee` (`employee_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES ('8001','John','Jacob','System Administrator','john@gmail.com','Administration','1234567890',NULL,'ACTIVE'),('8002','Michael','Anderson','Senior Manager','michael@company.com','Operations','9000000001',NULL,'ACTIVE'),('8003','Sophia','Reed','Project Manager','sophia@company.com','IT','9000000002','8002','ACTIVE'),('8004','Daniel','Wright','Software Engineer','daniel@company.com','IT','9000000003','8003','ACTIVE'),('8005','Olivia','Parker','UI/UX Designer','olivia@company.com','Design','900000006','8003','ACTIVE'),('8006','Ethan','Bennett','Finance Manager','ethan@company.com','Finance','9000000005','8002','ACTIVE'),('8007','Emma','Clark','Accountant','emma@company.com','Finance','9000000006','8006','ACTIVE'),('8008','Lucas','Hill','Financial Analyst','lucas@company.com','Finance','9000000007','8006','ACTIVE');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_login`
--

DROP TABLE IF EXISTS `employee_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_login` (
  `login_id` varchar(10) NOT NULL,
  `role` varchar(15) NOT NULL,
  `employee_id` varchar(10) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`login_id`),
  KEY `employee_id_idx` (`employee_id`),
  CONSTRAINT `fk_employee_login_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_login`
--

LOCK TABLES `employee_login` WRITE;
/*!40000 ALTER TABLE `employee_login` DISABLE KEYS */;
INSERT INTO `employee_login` VALUES ('L1','ADMIN','8001','$2b$10$sBmE3oGoJn1UGirFvxN02ORAq6GbEan7ZwZwspeejIBzx23/WFe/G'),('L8002','MANAGER','8002','$2b$10$h0Lo7QWsn06bIpgneyQPFemOOe3sVA/5X92CTq7SK9uGmjIMYXaxO'),('L8003','MANAGER','8003','$2b$10$cgjhlRqxb7JjXW/y.cRnPOP9fj.3HnlxZpE.I53q2gdfA/uqfsF5S'),('L8004','EMPLOYEE','8004','$2b$10$ZQgtjPmEAvJ3Ln9Q1TTaCenfzjO0jZNmrqGWJRWdhtSS.eJP7mcZ6'),('L8005','EMPLOYEE','8005','$2b$10$MWxlT1v21kdEx92FTrof4eRWDRF9R1VqkSAYuOAqFarhXbjo.1wDy'),('L8006','MANAGER','8006','$2b$10$diUJJDZaGxHR/3Znm2gikOpXrPWfA8rQsKMZ2M4CN6hvMvUyPmijS'),('L8007','EMPLOYEE','8007','$2b$10$PC/j0lLaxfzlSAvNiA0jIuV5RBs5Q396OV0LVdLWxojxS370FGb6W'),('L8008','EMPLOYEE','8008','$2b$10$rn2t1ADXaGkbl5Hm1it5BOhkn5vX.ZyobOErtCO2IPneKmZRVi0EC');
/*!40000 ALTER TABLE `employee_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holidays`
--

DROP TABLE IF EXISTS `holidays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holidays` (
  `holiday_id` int NOT NULL AUTO_INCREMENT,
  `holiday_name` varchar(100) NOT NULL,
  `holiday_date` date NOT NULL,
  `holiday_type` enum('FIXED','OPTIONAL') NOT NULL,
  `created_by` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`holiday_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `holidays_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holidays`
--

LOCK TABLES `holidays` WRITE;
/*!40000 ALTER TABLE `holidays` DISABLE KEYS */;
INSERT INTO `holidays` VALUES (1,'Holi','2025-03-14','FIXED','8001','2025-10-15 08:49:02'),(2,'Id-ul-Fitr','2025-03-31','FIXED','8001','2025-10-15 08:49:02'),(3,'Mahavir Jayanti','2025-04-10','FIXED','8001','2025-10-15 08:49:02'),(4,'Good Friday','2025-04-18','FIXED','8001','2025-10-15 08:49:02'),(5,'Buddha Purnima','2025-05-12','FIXED','8001','2025-10-15 08:49:02'),(6,'Independence Day','2025-08-15','FIXED','8001','2025-10-15 08:49:02'),(7,'Ganesh Chaturthi','2025-08-27','FIXED','8001','2025-10-15 08:49:02'),(8,'Milad-un-Nabi / Id-e-Milad','2025-09-05','FIXED','8001','2025-10-15 08:49:02'),(9,'Gandhi Jayanti','2025-10-02','FIXED','8001','2025-10-15 08:49:02'),(10,'Diwali (Deepavali)','2025-10-21','FIXED','8001','2025-10-15 08:49:02'),(11,'Guru Nanak Jayanti','2025-11-05','FIXED','8001','2025-10-15 08:49:02'),(12,'Christmas Day','2025-12-25','FIXED','8001','2025-10-15 08:49:02'),(13,'New Year’s Day','2025-01-01','OPTIONAL','8001','2025-10-15 08:49:02'),(14,'Chhath Puja','2025-10-28','OPTIONAL','8001','2025-10-15 08:49:02'),(15,'Guru Nanak Jayanti','2025-11-05','OPTIONAL','8001','2025-10-15 08:49:02'),(16,'Christmas Eve','2025-12-24','OPTIONAL','8001','2025-10-15 08:49:02');
/*!40000 ALTER TABLE `holidays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_application`
--

DROP TABLE IF EXISTS `leave_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_application` (
  `leave_application_id` varchar(10) NOT NULL,
  `leave_purpose` varchar(20) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `applied_date` date NOT NULL,
  `leave_type_id` varchar(15) NOT NULL,
  `status_id` varchar(10) NOT NULL,
  `employee_id` varchar(10) NOT NULL,
  `status_note` varchar(100) DEFAULT NULL,
  `no_of_days` decimal(4,1) NOT NULL DEFAULT '1.0',
  PRIMARY KEY (`leave_application_id`),
  KEY `leave_type_id_idx` (`leave_type_id`),
  KEY `status_id_idx` (`status_id`),
  KEY `employee_id_idx` (`employee_id`),
  CONSTRAINT `fk_leave_application_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
  CONSTRAINT `fk_leave_application_leave_type` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type` (`leave_type_id`),
  CONSTRAINT `fk_leave_application_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_application`
--

LOCK TABLES `leave_application` WRITE;
/*!40000 ALTER TABLE `leave_application` DISABLE KEYS */;
INSERT INTO `leave_application` VALUES ('LA0001','fever','2025-10-16','2025-10-16','2025-10-14','LT-02','4','8003','fake',0.5),('LA0002','headache','2025-10-17','2025-10-17','2025-10-15','LT-02','3','8003','',1.0),('LA0003','Vacation','2025-10-16','2025-10-20','2025-10-15','LT-01','4','8003','',5.0),('LA0004','Vacation','2025-10-16','2025-10-20','2025-10-15','LT-01','4','8007','',5.0),('LA0005','Vacation','2025-10-20','2025-10-24','2025-10-15','LT-01','1','8007',NULL,5.0),('LA0006','Fever','2025-10-27','2025-10-27','2025-10-15','LT-02','1','8007',NULL,1.0),('LA0007','Fever','2025-10-30','2025-10-30','2025-10-15','LT-02','1','8007',NULL,1.0);
/*!40000 ALTER TABLE `leave_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_details`
--

DROP TABLE IF EXISTS `leave_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_details` (
  `leave_details_id` int NOT NULL AUTO_INCREMENT,
  `balanced_leaves` decimal(5,2) unsigned NOT NULL,
  `used_leaves` decimal(5,2) unsigned NOT NULL,
  `leave_type_id` varchar(15) NOT NULL,
  `employee_id` varchar(10) NOT NULL,
  PRIMARY KEY (`leave_details_id`),
  KEY `leave_type_id_idx` (`leave_type_id`),
  KEY `employee_id_idx` (`employee_id`),
  CONSTRAINT `fk_leave_details_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
  CONSTRAINT `fk_leave_details_leave_type` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type` (`leave_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_details`
--

LOCK TABLES `leave_details` WRITE;
/*!40000 ALTER TABLE `leave_details` DISABLE KEYS */;
INSERT INTO `leave_details` VALUES (1,23.00,0.00,'LT-01','8001'),(2,23.00,0.00,'LT-01','8002'),(3,23.00,0.00,'LT-01','8003'),(4,12.00,0.00,'LT-02','8001'),(5,12.00,0.00,'LT-02','8002'),(6,10.50,0.00,'LT-02','8003'),(7,182.00,0.00,'LT-03','8001'),(8,182.00,0.00,'LT-03','8002'),(9,182.00,0.00,'LT-03','8003'),(10,0.00,0.00,'LT-04','8001'),(11,0.00,0.00,'LT-04','8002'),(12,0.00,0.00,'LT-04','8003'),(13,5.00,0.00,'LT-05','8001'),(14,5.00,0.00,'LT-05','8002'),(15,5.00,0.00,'LT-05','8003'),(16,2.00,0.00,'LT-06','8001'),(17,2.00,0.00,'LT-06','8002'),(18,2.00,0.00,'LT-06','8003'),(19,25.00,0.00,'LT-01','8006'),(20,25.00,0.00,'LT-01','8004'),(21,25.00,0.00,'LT-01','8005'),(22,20.00,0.00,'LT-01','8007'),(23,25.00,0.00,'LT-01','8008'),(26,12.00,0.00,'LT-02','8006'),(27,12.00,0.00,'LT-02','8004'),(28,12.00,0.00,'LT-02','8005'),(29,10.00,0.00,'LT-02','8007'),(30,12.00,0.00,'LT-02','8008'),(33,182.00,0.00,'LT-03','8006'),(34,182.00,0.00,'LT-03','8004'),(35,182.00,0.00,'LT-03','8005'),(36,182.00,0.00,'LT-03','8007'),(37,182.00,0.00,'LT-03','8008'),(40,0.00,0.00,'LT-04','8006'),(41,0.00,0.00,'LT-04','8004'),(42,0.00,0.00,'LT-04','8005'),(43,0.00,0.00,'LT-04','8007'),(44,0.00,0.00,'LT-04','8008'),(47,5.00,0.00,'LT-05','8006'),(48,5.00,0.00,'LT-05','8004'),(49,5.00,0.00,'LT-05','8005'),(50,5.00,0.00,'LT-05','8007'),(51,5.00,0.00,'LT-05','8008'),(54,2.00,0.00,'LT-06','8006'),(55,2.00,0.00,'LT-06','8004'),(56,2.00,0.00,'LT-06','8005'),(57,2.00,0.00,'LT-06','8007'),(58,2.00,0.00,'LT-06','8008');
/*!40000 ALTER TABLE `leave_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_type`
--

DROP TABLE IF EXISTS `leave_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_type` (
  `leave_type_id` varchar(15) NOT NULL,
  `approval_type` varchar(15) NOT NULL,
  `leave_type_name` varchar(20) NOT NULL,
  `no_of_leaves_per_year` decimal(5,2) NOT NULL,
  PRIMARY KEY (`leave_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_type`
--

LOCK TABLES `leave_type` WRITE;
/*!40000 ALTER TABLE `leave_type` DISABLE KEYS */;
INSERT INTO `leave_type` VALUES ('LT-01','MANAGER','Vacation',25.00),('LT-02','MANAGER','Sick/Casual',12.00),('LT-03','MANAGER','Maternity',182.00),('LT-04','MANAGER','Compensatory',0.00),('LT-05','MANAGER','Bereavement',5.00),('LT-06','AUTO','Optional',2.00);
/*!40000 ALTER TABLE `leave_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `status_id` varchar(10) NOT NULL,
  `status_name` varchar(20) NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES ('1','Pending'),('2','Saved'),('3','Approved'),('4','Rejected');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-18 16:00:52
