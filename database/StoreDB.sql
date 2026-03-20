-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Mar 15, 2026 at 12:52 PM
-- Server version: 8.0.45
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `StoreDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `Admin`
--

CREATE TABLE `Admin` (
  `Admin_id` int NOT NULL,
  `Admin_user` varchar(20) NOT NULL,
  `Admin_password` int NOT NULL,
  `Admin_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Admin`
--

INSERT INTO `Admin` (`Admin_id`, `Admin_user`, `Admin_password`, `Admin_name`) VALUES
(1, 'admin', 123456, 'Kim moren');

-- --------------------------------------------------------

--
-- Table structure for table `Reservations`
--

CREATE TABLE `Reservations` (
  `Reservation_id` int NOT NULL,
  `User_id` int NOT NULL,
  `Table_id` int NOT NULL,
  `Admin_id` int DEFAULT NULL,
  `Reserve_date` date NOT NULL,
  `Reserve_time` varchar(20) NOT NULL,
  `Customer_come` int NOT NULL DEFAULT '1',
  `Status` enum('รอดำเนินการ','จองสำเร็จ','จองไม่สำเร็จ') NOT NULL DEFAULT 'รอดำเนินการ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Reservations`
--

INSERT INTO `Reservations` (`Reservation_id`, `User_id`, `Table_id`, `Admin_id`, `Reserve_date`, `Reserve_time`, `Customer_come`, `Status`) VALUES
(1, 17, 2, NULL, '2026-03-14', '2026-03-14 20:13:36', 0, 'รอดำเนินการ'),
(2, 18, 1, NULL, '2026-03-15', '2026-03-15 06:29:43', 0, 'รอดำเนินการ'),
(3, 19, 1, NULL, '2026-03-15', '2026-03-15 06:30:12', 0, 'รอดำเนินการ'),
(4, 24, 1, NULL, '2026-03-16', '10:00-11.00', 0, 'รอดำเนินการ'),
(5, 25, 1, NULL, '2026-03-16', '10:00-11.00', 0, 'รอดำเนินการ'),
(6, 26, 1, NULL, '2026-03-16', '10:00-11.00', 0, 'รอดำเนินการ'),
(7, 27, 1, NULL, '2026-03-16', '10:00-11.00', 0, 'รอดำเนินการ'),
(8, 28, 1, NULL, '2026-03-16', '10:00-11.00', 0, 'รอดำเนินการ');

-- --------------------------------------------------------

--
-- Table structure for table `Table Detail`
--

CREATE TABLE `Table Detail` (
  `Table_ID` int NOT NULL,
  `Table_zone` varchar(1) NOT NULL,
  `Table_Number` varchar(3) NOT NULL,
  `capacity` int NOT NULL,
  `Current_Status` enum('ว่าง','ไม่ว่าง','รอดำเนินการ') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'ว่าง'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Table Detail`
--

INSERT INTO `Table Detail` (`Table_ID`, `Table_zone`, `Table_Number`, `capacity`, `Current_Status`) VALUES
(1, 'B', 'A1', 4, 'รอดำเนินการ'),
(2, 'B', 'A2', 4, 'รอดำเนินการ');

-- --------------------------------------------------------

--
-- Table structure for table `Table_Status`
--

CREATE TABLE `Table_Status` (
  `Log_id` int NOT NULL,
  `Table_id` int NOT NULL,
  `Start_time` datetime NOT NULL,
  `End_time` datetime NOT NULL,
  `Status` enum('โต๊ะไม่ว่าง','รอดำเนินการ','โต๊ะว่าง') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'โต๊ะว่าง',
  `Admin_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Table_Status`
--

INSERT INTO `Table_Status` (`Log_id`, `Table_id`, `Start_time`, `End_time`, `Status`, `Admin_id`) VALUES
(1, 1, '2026-03-16 10:00:00', '2026-03-16 11:00:00', 'โต๊ะไม่ว่าง', 0);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `User_id` int NOT NULL,
  `First_name` varchar(255) NOT NULL,
  `Last_name` varchar(255) NOT NULL,
  `Phone_number` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`User_id`, `First_name`, `Last_name`, `Phone_number`) VALUES
(1, 'KANGHARIN', 'BAMBAM', 123456789),
(2, 'Simmie', 'detme', 5565826),
(3, 'Bam', 'blue', 6895814),
(4, 'Bam', 'blue', 5568956),
(5, 'we', 'Bam', 23425),
(6, 'we', 'weva', 2342425),
(7, 'wqe', 'sokcp5', 4353536),
(8, 'sadasdwq', 'qwee', 2324252),
(9, 'we', 'Bam', 778899),
(10, 'qwex', 'dqefw', 48462),
(11, 'qwex', 'dqefw', 48462),
(12, 'qwex', 'dqefw', 48462),
(13, 'qwex', 'dqefw', 48462),
(14, 'qwe', 'mghn', 485626),
(15, 'qwe', 'mghn', 485626),
(16, 'Bam', 'qwe', 32141),
(17, 'wejp', 'ydto[kgm', 95656),
(18, 'we', 'dasd54', 655558998),
(19, 'we', 'dasd54', 655558998),
(20, 'wqe', 'blue', 5568956),
(21, 'wqe', 'blue', 5568956),
(22, 'we', 'Bam', 655558998),
(23, 'we', 'Bam', 2313),
(24, 'wqe', 'blue', 655558998),
(25, 'wqe', 'blue', 2313),
(26, 'we', 'Bam', 5568956),
(27, 'we', 'blue', 655558998),
(28, 'we', 'blue', 655558998);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Admin`
--
ALTER TABLE `Admin`
  ADD PRIMARY KEY (`Admin_id`);

--
-- Indexes for table `Reservations`
--
ALTER TABLE `Reservations`
  ADD PRIMARY KEY (`Reservation_id`),
  ADD KEY `User_id` (`User_id`),
  ADD KEY `Table_id` (`Table_id`),
  ADD KEY `Admin_id` (`Admin_id`);

--
-- Indexes for table `Table Detail`
--
ALTER TABLE `Table Detail`
  ADD PRIMARY KEY (`Table_ID`);

--
-- Indexes for table `Table_Status`
--
ALTER TABLE `Table_Status`
  ADD PRIMARY KEY (`Log_id`),
  ADD KEY `Table_id` (`Table_id`),
  ADD KEY `Admin_id` (`Admin_id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`User_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Admin`
--
ALTER TABLE `Admin`
  MODIFY `Admin_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Reservations`
--
ALTER TABLE `Reservations`
  MODIFY `Reservation_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Table Detail`
--
ALTER TABLE `Table Detail`
  MODIFY `Table_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Table_Status`
--
ALTER TABLE `Table_Status`
  MODIFY `Log_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `User_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Reservations`
--
ALTER TABLE `Reservations`
  ADD CONSTRAINT `fk_res_admin` FOREIGN KEY (`Admin_id`) REFERENCES `Admin` (`Admin_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_res_table` FOREIGN KEY (`Table_id`) REFERENCES `Table Detail` (`Table_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_res_user` FOREIGN KEY (`User_id`) REFERENCES `User` (`User_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `Table_Status`
--
ALTER TABLE `Table_Status`
  ADD CONSTRAINT `fk_tabledetail` FOREIGN KEY (`Table_id`) REFERENCES `Table Detail` (`Table_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
