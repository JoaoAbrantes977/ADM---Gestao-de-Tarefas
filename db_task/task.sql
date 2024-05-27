SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de dados: `adm_task`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `task`
--

CREATE TABLE `task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` varchar(60) NOT NULL,
  `title` varchar(60) NOT NULL,
  `description` text NOT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `task`
--

INSERT INTO `task` (`id_user`, `title`, `description`, `status`, `createdAt`, `updatedAt`) VALUES
('1', 'Tarefa 1', 'Tarefa de microserviços 1', 1, '2024-05-26 14:44:01', '2024-05-26 14:44:01'),
('2', 'Tarefa 2 ', 'Tarefa de microserviços 2', 1, '2024-05-26 15:16:16', '2024-05-26 15:41:13'),
('3', 'Tarefa 3', 'Tarefa de microserviços 3', 1, '2024-05-26 14:48:47', '2024-05-26 14:48:47'),
('4', 'Tarefa 4', 'Tarefa de microserviços 4', 1, '2024-05-26 14:48:38', '2024-05-26 14:59:37');

ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;