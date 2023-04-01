CREATE TABLE `users` (
  `id` varchar(12) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified` datetime(6) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);

CREATE TABLE `accounts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` varchar(12) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `provider_account_id` varchar(255) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `expires_at` bigint DEFAULT NULL,
  `token_type` varchar(255) DEFAULT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `id_token` text,
  `session_state` varchar(255) DEFAULT NULL,
  `oauth_token_secret` varchar(255) DEFAULT NULL,
  `oauth_token` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
);

CREATE TABLE `sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` varchar(12) NOT NULL,
  `expires` datetime(6) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sessionToken` (`session_token`),
  KEY `user_id` (`user_id`)
);

CREATE TABLE `verification_tokens` (
  `identifier` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` datetime(6) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`token`)
);