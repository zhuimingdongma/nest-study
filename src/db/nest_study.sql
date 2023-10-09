/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306_1
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost:3306
 Source Schema         : nest_study

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : 65001

 Date: 06/10/2023 17:38:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for game_list
-- ----------------------------
DROP TABLE IF EXISTS `game_list`;
CREATE TABLE `game_list`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sort` int(11) NOT NULL,
  `price_range` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `type` int(11) NOT NULL,
  `agentArr` json NULL,
  `btn` json NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `label` json NOT NULL,
  `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_list
-- ----------------------------

-- ----------------------------
-- Table structure for goods_attr
-- ----------------------------
DROP TABLE IF EXISTS `goods_attr`;
CREATE TABLE `goods_attr`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `type` int(11) NOT NULL,
  `value` double NOT NULL,
  `minPrice` double NOT NULL DEFAULT 0,
  `maxPrice` double NOT NULL DEFAULT 500000,
  `sort` int(11) NOT NULL DEFAULT 0,
  `isRequired` tinyint(4) NOT NULL DEFAULT 0,
  `createdTime` date NOT NULL,
  `updateTime` date NOT NULL,
  `gameListId` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_d6cb1ae3d0633e47e305cd83395`(`gameListId`) USING BTREE,
  CONSTRAINT `FK_d6cb1ae3d0633e47e305cd83395` FOREIGN KEY (`gameListId`) REFERENCES `game_list` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of goods_attr
-- ----------------------------

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `path` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES ('首页', '/dashboard', '', 11);
INSERT INTO `menu` VALUES ('系统设置', '/system', '', 12);
INSERT INTO `menu` VALUES ('文件列表', '/system_oss', '', 13);
INSERT INTO `menu` VALUES ('权限管理', '/perm', '', 14);
INSERT INTO `menu` VALUES ('用户管理', '/perm_users', '', 15);
INSERT INTO `menu` VALUES ('角色管理', '/perm_roles', '', 16);
INSERT INTO `menu` VALUES ('资源管理', '/system_menus', '', 17);
INSERT INTO `menu` VALUES ('重置密码', '/perm_users:resetPw', '', 18);
INSERT INTO `menu` VALUES ('部门管理', '/perm_depts', '', 19);
INSERT INTO `menu` VALUES ('岗位管理', '/perm_posts', '', 20);

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `permission` VALUES ('839bf55f-6262-11ee-8919-088fc382449c', 'tourist');
INSERT INTO `permission` VALUES ('839c279b-6262-11ee-8919-088fc382449c', 'common');
INSERT INTO `permission` VALUES ('839c28ec-6262-11ee-8919-088fc382449c', 'admin');
INSERT INTO `permission` VALUES ('839c2925-6262-11ee-8919-088fc382449c', 'super');

-- ----------------------------
-- Table structure for permission_menu
-- ----------------------------
DROP TABLE IF EXISTS `permission_menu`;
CREATE TABLE `permission_menu`  (
  `menuId` int(11) NOT NULL,
  `permissionId` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`menuId`, `permissionId`) USING BTREE,
  INDEX `IDX_7bc8cccc30546d6cb89fecb829`(`menuId`) USING BTREE,
  INDEX `IDX_fcf4b987b1ac50706a7825abc9`(`permissionId`) USING BTREE,
  CONSTRAINT `FK_7bc8cccc30546d6cb89fecb8299` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_fcf4b987b1ac50706a7825abc96` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permission_menu
-- ----------------------------
INSERT INTO `permission_menu` VALUES (11, '839c279b-6262-11ee-8919-088fc382449c');
INSERT INTO `permission_menu` VALUES (12, '839c28ec-6262-11ee-8919-088fc382449c');
INSERT INTO `permission_menu` VALUES (13, '839c279b-6262-11ee-8919-088fc382449c');
INSERT INTO `permission_menu` VALUES (14, '839c28ec-6262-11ee-8919-088fc382449c');
INSERT INTO `permission_menu` VALUES (15, '839c28ec-6262-11ee-8919-088fc382449c');
INSERT INTO `permission_menu` VALUES (16, '839c28ec-6262-11ee-8919-088fc382449c');
INSERT INTO `permission_menu` VALUES (17, '839c279b-6262-11ee-8919-088fc382449c');
INSERT INTO `permission_menu` VALUES (18, '839c279b-6262-11ee-8919-088fc382449c');
INSERT INTO `permission_menu` VALUES (19, '839c28ec-6262-11ee-8919-088fc382449c');
INSERT INTO `permission_menu` VALUES (20, '839c28ec-6262-11ee-8919-088fc382449c');

-- ----------------------------
-- Table structure for photo
-- ----------------------------
DROP TABLE IF EXISTS `photo`;
CREATE TABLE `photo`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `filename` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `views` int(11) NOT NULL,
  `isPublished` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of photo
-- ----------------------------

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('5fb1f870-6261-11ee-8919-088fc382449c', 'user');
INSERT INTO `role` VALUES ('5fb20dc7-6261-11ee-8919-088fc382449c', 'admin');
INSERT INTO `role` VALUES ('5fb20f6e-6261-11ee-8919-088fc382449c', 'super');
INSERT INTO `role` VALUES ('9a945c51-6262-11ee-8919-088fc382449c', 'tourist');

-- ----------------------------
-- Table structure for role_permission
-- ----------------------------
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission`  (
  `roleId` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `permissionId` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`roleId`, `permissionId`) USING BTREE,
  INDEX `IDX_e3130a39c1e4a740d044e68573`(`roleId`) USING BTREE,
  INDEX `IDX_72e80be86cab0e93e67ed1a7a9`(`permissionId`) USING BTREE,
  CONSTRAINT `FK_72e80be86cab0e93e67ed1a7a9a` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_e3130a39c1e4a740d044e685730` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_permission
-- ----------------------------
INSERT INTO `role_permission` VALUES ('5fb20dc7-6261-11ee-8919-088fc382449c', '839c28ec-6262-11ee-8919-088fc382449c');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `account` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '冬马和纱',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `phone` int(11) NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('243d8277-8914-4e65-9f22-1b82614357b2', '冬马和纱', '冬马和纱', 'YUge1858382..*', '', 0, '', 0);
INSERT INTO `user` VALUES ('59394484-a961-4c5a-a42e-001853998f6f', '椎名真白', '冬马和纱', 'DSAdsc51653.*ds', '', 0, '', 0);

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles`  (
  `userId` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `roleId` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`userId`, `roleId`) USING BTREE,
  INDEX `IDX_472b25323af01488f1f66a06b6`(`userId`) USING BTREE,
  INDEX `IDX_86033897c009fcca8b6505d6be`(`roleId`) USING BTREE,
  CONSTRAINT `FK_472b25323af01488f1f66a06b67` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_86033897c009fcca8b6505d6be2` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO `user_roles` VALUES ('243d8277-8914-4e65-9f22-1b82614357b2', '5fb20dc7-6261-11ee-8919-088fc382449c');
INSERT INTO `user_roles` VALUES ('59394484-a961-4c5a-a42e-001853998f6f', '5fb1f870-6261-11ee-8919-088fc382449c');

SET FOREIGN_KEY_CHECKS = 1;
