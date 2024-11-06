SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '3534ec1c-3e69-4cf1-b0dc-8eae5f14bb6f', '{"action":"user_signedup","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"kakao"}}', '2024-11-05 04:42:51.250164+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c159c61-20ec-4cc4-931a-3b9a46d3ba43', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 05:41:21.029123+00', ''),
	('00000000-0000-0000-0000-000000000000', '66441490-808f-4386-bb13-8a03479320a6', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 05:41:21.029772+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd076a425-cb1b-4281-a400-d69099558d32', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 06:39:22.66798+00', ''),
	('00000000-0000-0000-0000-000000000000', '1fbe5100-0ec6-4781-a806-138f030e0a70', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 06:39:22.669237+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b0d5e1e8-823e-4def-ac47-cd7b6322d43d', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 07:37:24.228888+00', ''),
	('00000000-0000-0000-0000-000000000000', '42d51f6a-cfbf-4402-93e2-b3eb1b8d88b7', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 07:37:24.230366+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac456603-9590-4947-acb9-989af4a3f324', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 08:35:25.554559+00', ''),
	('00000000-0000-0000-0000-000000000000', '09abeb21-f4de-41b8-9921-9c7b1008004e', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 08:35:25.556621+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc8b94a1-cef6-424c-b174-08d450c10bb3', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 09:33:26.991206+00', ''),
	('00000000-0000-0000-0000-000000000000', '74560c74-1277-456b-8094-78d83034ae5e', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 09:33:26.993171+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f05dfa44-8eb7-4d0a-afc5-321d878d7d9f', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 10:31:51.965023+00', ''),
	('00000000-0000-0000-0000-000000000000', '8850a88e-6bc2-41fd-a6ae-4de21472fc98', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 10:31:51.966348+00', ''),
	('00000000-0000-0000-0000-000000000000', '2a83a5c3-3912-4095-8edd-01fee9eb3d52', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 11:30:20.66215+00', ''),
	('00000000-0000-0000-0000-000000000000', '21949d46-9bde-4171-a1da-ae4d4b0d2d92', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 11:30:20.665055+00', ''),
	('00000000-0000-0000-0000-000000000000', '6e0c2d02-5c0d-4f2f-8edb-5812af64eb71', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 12:28:40.886943+00', ''),
	('00000000-0000-0000-0000-000000000000', '3742b123-ebfe-4473-9e3d-8fe150215cac', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 12:28:40.888957+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc036c20-63a5-4931-a98a-92a11b9c2d34', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 13:24:01.564011+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea7bbf5d-023d-4419-9d0e-08335bed2f90', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 13:24:01.5726+00', ''),
	('00000000-0000-0000-0000-000000000000', '82c47877-514a-49ac-aa97-5a84bd67de3e', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 14:22:14.080143+00', ''),
	('00000000-0000-0000-0000-000000000000', '58dfd14a-e46d-43b4-b7bd-cae197d1f2ad', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 14:22:14.082179+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b772046-a5c1-425c-ad28-6eb4ac42c197', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 15:20:27.655779+00', ''),
	('00000000-0000-0000-0000-000000000000', '5147dde7-9e10-464e-945b-5695badb595b', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 15:20:27.657919+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b6154ac-daf5-403d-9d3b-40de0dec8e95', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 16:18:56.924994+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a003e03b-8f9c-44f4-9e26-1f3e18a2e18f', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 16:18:56.926105+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5c10cc3-9f38-440e-9521-671195ad7623', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 17:17:04.043769+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dab32de0-ef3d-469e-a4cf-3e4ae65efcd5', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 17:17:04.048107+00', ''),
	('00000000-0000-0000-0000-000000000000', '2fc5b8b1-5c41-4382-9898-51de89eb9e27', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 18:04:36.633187+00', ''),
	('00000000-0000-0000-0000-000000000000', '06fc705e-318f-4cd5-b2a7-934a42f8dddb', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 18:04:36.635908+00', ''),
	('00000000-0000-0000-0000-000000000000', '19c7e2a4-1e2c-4cde-af60-c9b3228e844c', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 18:53:43.162469+00', ''),
	('00000000-0000-0000-0000-000000000000', '59be6670-69ff-46d1-a00b-b91a44d21eae', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 18:53:43.177186+00', ''),
	('00000000-0000-0000-0000-000000000000', '07854c05-0bc8-48ec-bff8-9dd47ef75d65', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 19:51:58.608576+00', ''),
	('00000000-0000-0000-0000-000000000000', '516d6eaf-452a-4b79-8e7b-c5a4109ca9a1', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 19:51:58.610304+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc207611-6d6a-429c-9f39-5fad8ca55c58', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 20:49:23.290253+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef16d1b1-87bf-4b8c-9e51-8d5dfb6ca717', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 20:49:23.291952+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5ca120f-94ac-4681-b0f3-939f39bbd817', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 21:33:11.472481+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a8f5d89-d7bb-4ed8-bec5-58b6874d4308', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 21:33:11.474617+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ddb53ef0-7e97-4540-9cca-3ce6d777f247', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 22:22:09.440472+00', ''),
	('00000000-0000-0000-0000-000000000000', '57897ca8-3344-4753-9013-5d7e8dda0565', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 22:22:09.443505+00', ''),
	('00000000-0000-0000-0000-000000000000', '5a2f56b9-2d81-4bb3-8733-e9a7e7f8f922', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 23:20:37.595872+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac5628d6-5057-4e56-bb9b-f4f4746ea26b', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-05 23:20:37.598275+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f053da35-5601-495a-b616-2674ae6c6b3d', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 00:19:02.312682+00', ''),
	('00000000-0000-0000-0000-000000000000', '48404d0c-23fe-4a70-b4a2-ac55bde7c4ce', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 00:19:02.314243+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b494056b-b68f-4e16-83f9-b7f96b0ea69d', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 01:17:02.581387+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f17eb57-a40a-4faa-9afb-b3aeeff8b105', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 01:17:02.583752+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f66cdb6-1eff-4116-8118-fd71039ba6aa', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 02:15:02.73863+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e03a8189-bae1-4920-b6d2-c3c4973f82c5', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 02:15:02.739791+00', ''),
	('00000000-0000-0000-0000-000000000000', '762549f0-d180-42a7-9351-05de010c16f1', '{"action":"token_refreshed","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 03:13:11.204771+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b29779ce-e056-4132-b9bf-daca5493f7fc', '{"action":"token_revoked","actor_id":"859133bf-bbea-4a0d-bf64-bf3023e718cb","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 03:13:11.206289+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '859133bf-bbea-4a0d-bf64-bf3023e718cb', 'authenticated', 'authenticated', 'rarira@gmail.com', NULL, '2024-11-05 04:42:51.251021+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-11-05 04:42:51.252125+00', '{"provider": "kakao", "providers": ["kakao"]}', '{"iss": "https://kauth.kakao.com", "sub": "3622146035", "name": "박인성", "email": "rarira@gmail.com", "picture": "https://k.kakaocdn.net/dn/bKtmuJ/btqAq8w5UdX/5KXg5IyYqaKjc2UztsbIX0/img_110x110.jpg", "provider_id": "3622146035", "email_verified": true, "phone_verified": false, "preferred_username": "박인성"}', NULL, '2024-11-05 04:42:51.240924+00', '2024-11-06 03:13:11.209956+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('3622146035', '859133bf-bbea-4a0d-bf64-bf3023e718cb', '{"iss": "https://kauth.kakao.com", "sub": "3622146035", "name": "박인성", "email": "rarira@gmail.com", "picture": "https://k.kakaocdn.net/dn/bKtmuJ/btqAq8w5UdX/5KXg5IyYqaKjc2UztsbIX0/img_110x110.jpg", "provider_id": "3622146035", "email_verified": true, "phone_verified": false, "preferred_username": "박인성"}', 'kakao', '2024-11-05 04:42:51.247578+00', '2024-11-05 04:42:51.247611+00', '2024-11-05 04:42:51.247611+00', '79a8c243-c5e0-4b6b-a69d-2b1dee5600a0');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('eab01c8a-5f22-459c-b26f-17e2a9c92dcb', '859133bf-bbea-4a0d-bf64-bf3023e718cb', '2024-11-05 04:42:51.252185+00', '2024-11-06 03:13:11.21109+00', NULL, 'aal1', NULL, '2024-11-06 03:13:11.211058', 'cococom/1 CFNetwork/1568.200.51 Darwin/24.1.0', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('eab01c8a-5f22-459c-b26f-17e2a9c92dcb', '2024-11-05 04:42:51.255144+00', '2024-11-05 04:42:51.255144+00', 'oauth', '6c44454b-efef-4645-a63c-a339595faf43');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'fo3z7HmI1M9J5UmueVR2SA', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 04:42:51.253448+00', '2024-11-05 05:41:21.030016+00', NULL, 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 2, 'Wfd5Ebvk5t1T29QVjSlqXA', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 05:41:21.030739+00', '2024-11-05 06:39:22.669695+00', 'fo3z7HmI1M9J5UmueVR2SA', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 3, 'TbbUuidl8fNe3oHaUW4EKA', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 06:39:22.670525+00', '2024-11-05 07:37:24.230817+00', 'Wfd5Ebvk5t1T29QVjSlqXA', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 4, 'HZ9EHhk-xNNa07MHMvsU0A', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 07:37:24.231672+00', '2024-11-05 08:35:25.55733+00', 'TbbUuidl8fNe3oHaUW4EKA', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 5, 'tcE_aNqgkNCcGll_VAV7Ug', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 08:35:25.558473+00', '2024-11-05 09:33:26.99356+00', 'HZ9EHhk-xNNa07MHMvsU0A', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 6, 'eOxuICWfYqPDgTbLzcrE2Q', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 09:33:26.995353+00', '2024-11-05 10:31:51.966821+00', 'tcE_aNqgkNCcGll_VAV7Ug', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 7, 'SAvZr9-KeHDzPsvof4zK0A', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 10:31:51.967934+00', '2024-11-05 11:30:20.665315+00', 'eOxuICWfYqPDgTbLzcrE2Q', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 8, 't1LsUmk9Av7Ee4-YCrCMNA', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 11:30:20.667185+00', '2024-11-05 12:28:40.88964+00', 'SAvZr9-KeHDzPsvof4zK0A', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 9, 'c1SeZ-q9ZL4oAYQtaE4CNQ', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 12:28:40.890937+00', '2024-11-05 13:24:01.573045+00', 't1LsUmk9Av7Ee4-YCrCMNA', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 10, 'MUGoNmKqJWWEIkc3r8ZNvg', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 13:24:01.581047+00', '2024-11-05 14:22:14.082584+00', 'c1SeZ-q9ZL4oAYQtaE4CNQ', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 11, '_v075DFKIkecUGgcrHsASw', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 14:22:14.084065+00', '2024-11-05 15:20:27.658219+00', 'MUGoNmKqJWWEIkc3r8ZNvg', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 12, '-4hrWRdZlgZYv5cPU3CzEA', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 15:20:27.660117+00', '2024-11-05 16:18:56.926467+00', '_v075DFKIkecUGgcrHsASw', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 13, 't-fuDdZDxGDK-I6LMSbKXQ', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 16:18:56.927203+00', '2024-11-05 17:17:04.048528+00', '-4hrWRdZlgZYv5cPU3CzEA', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 14, 'KsdwWK7ZfAuZB3fUq8jTkQ', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 17:17:04.049751+00', '2024-11-05 18:04:36.637078+00', 't-fuDdZDxGDK-I6LMSbKXQ', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 15, 'hB_DDA6o2LNx_J7Vhg0fzQ', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 18:04:36.639402+00', '2024-11-05 18:53:43.184318+00', 'KsdwWK7ZfAuZB3fUq8jTkQ', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 16, 'BWNvgsk0e1yVTiyKSDshog', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 18:53:43.188261+00', '2024-11-05 19:51:58.610712+00', 'hB_DDA6o2LNx_J7Vhg0fzQ', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 17, 'NRz2sKiP90d41O5bvCQWfw', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 19:51:58.612307+00', '2024-11-05 20:49:23.293582+00', 'BWNvgsk0e1yVTiyKSDshog', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 18, 'NdqaaYv167-vnwNzZnv-sw', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 20:49:23.294702+00', '2024-11-05 21:33:11.475429+00', 'NRz2sKiP90d41O5bvCQWfw', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 19, 'HcyUYLrAnmqftxYUfV1wdQ', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 21:33:11.476953+00', '2024-11-05 22:22:09.444616+00', 'NdqaaYv167-vnwNzZnv-sw', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 20, 'ogeXcbezCgYzqUFaO2d60g', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 22:22:09.446606+00', '2024-11-05 23:20:37.598705+00', 'HcyUYLrAnmqftxYUfV1wdQ', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 21, 'APl0jfWMOzsWAaC1GxuAFA', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-05 23:20:37.599734+00', '2024-11-06 00:19:02.314904+00', 'ogeXcbezCgYzqUFaO2d60g', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 22, 'uhsBNEt6sx-OuYU3TaULjA', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-06 00:19:02.316246+00', '2024-11-06 01:17:02.583966+00', 'APl0jfWMOzsWAaC1GxuAFA', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 23, '7jRrnTKU5oJH1qHXA3lsDA', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-06 01:17:02.586853+00', '2024-11-06 02:15:02.740009+00', 'uhsBNEt6sx-OuYU3TaULjA', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 24, 'Ecy4VbtEdOguNfxa6Ft4FQ', '859133bf-bbea-4a0d-bf64-bf3023e718cb', true, '2024-11-06 02:15:02.740764+00', '2024-11-06 03:13:11.206484+00', '7jRrnTKU5oJH1qHXA3lsDA', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb'),
	('00000000-0000-0000-0000-000000000000', 25, 'ICjC0Lb58ECFF6P-DGyX3w', '859133bf-bbea-4a0d-bf64-bf3023e718cb', false, '2024-11-06 03:13:11.208975+00', '2024-11-06 03:13:11.208975+00', 'Ecy4VbtEdOguNfxa6Ft4FQ', 'eab01c8a-5f22-459c-b26f-17e2a9c92dcb');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 25, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
