CREATE SCHEMA auth;

CREATE TABLE "auth"."users" (
    "id" bigserial NOT NULL,
    "name" varchar(255),
    "email" varchar(255),
    "email_verified" timestamp,
    "image" varchar(255),
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX auth_users_email_ukey ON users (email);

CREATE TABLE "auth"."accounts" (
    "id" bigserial NOT NULL,
    "user_id" bigint DEFAULT NULL,
    "type" varchar(255) NOT NULL,
    "provider" varchar(255) NOT NULL,
    "provider_account_id" varchar(255) NOT NULL,
    "refresh_token" varchar(255) DEFAULT NULL,
    "access_token" varchar(255) DEFAULT NULL,
    "expires_at" bigint DEFAULT NULL,
    "token_type" varchar(255) DEFAULT NULL,
    "scope" varchar(255) DEFAULT NULL,
    "id_token" text,
    "session_state" varchar(255) DEFAULT NULL,
    "oauth_token_secret" varchar(255) DEFAULT NULL,
    "oauth_token" varchar(255) DEFAULT NULL,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX auth_accounts_user_ukey ON accounts (user_id);

CREATE TABLE "auth"."sessions" (
    "id" bigserial NOT NULL,
    "user_id" bigint NOT NULL,
    "expires" timestamp NOT NULL,
    "session_token" varchar(255) NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX auth_session_token_ukey ON sessions (sessionToken);
CREATE UNIQUE INDEX auth_session_user_ukey ON sessions (user_id);

CREATE TABLE "auth"."verification_tokens" (
    "identifier" varchar(255) NOT NULL,
    "token" varchar(255) NOT NULL,
    "expires" timestamp NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    PRIMARY KEY ("token")
);