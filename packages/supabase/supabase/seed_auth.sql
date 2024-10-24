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
	('00000000-0000-0000-0000-000000000000', 'e393e92d-4ea4-42c0-b1ce-ff349556cd82', '{"action":"user_signedup","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"kakao"}}', '2024-10-23 05:32:17.272813+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a4dbce0-19ba-4b56-b49a-424678dc1ad6', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 06:30:30.579273+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eb3be8b3-eb55-4c81-ab63-bf9322713a8e', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 06:30:30.581231+00', ''),
	('00000000-0000-0000-0000-000000000000', '715e821e-7eec-47d4-a84d-4700a3cc05f3', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 07:15:06.35196+00', ''),
	('00000000-0000-0000-0000-000000000000', '8fca6d08-70af-4fe9-a4a8-f4116115410d', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 07:15:06.352911+00', ''),
	('00000000-0000-0000-0000-000000000000', '347d1cf4-7b35-4bf3-9471-a1f060dea3de', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 08:07:12.653194+00', ''),
	('00000000-0000-0000-0000-000000000000', '4ca4162f-2cc1-4f7b-8786-c6f309e1e9c6', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 08:07:12.654363+00', ''),
	('00000000-0000-0000-0000-000000000000', '202f6d5c-61c2-42fb-9c1b-3d5a1270440f', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 08:57:20.829504+00', ''),
	('00000000-0000-0000-0000-000000000000', '27e28d60-f64e-4c8a-9b45-858f8fc7c636', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 08:57:20.833613+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc1a6983-9d97-42b6-95d5-f2c735257e25', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 09:51:14.529654+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd4f273c0-57ee-449d-b063-a641000a8228', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 09:51:14.537424+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3e35f22-ea27-4bc2-92cb-47add4834164', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 10:49:40.487328+00', ''),
	('00000000-0000-0000-0000-000000000000', '84e45fae-b3cc-4326-92ed-76a572f6c329', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 10:49:40.488101+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ffa4454f-0bfc-4afc-a9df-2495f0030b92', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 11:47:41.892376+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fd954779-bad0-4afb-aa3c-1a131b11a991', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 11:47:41.893576+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ebf5fd9-643a-4047-9df7-5e1dbe40d5f8', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 12:45:41.236131+00', ''),
	('00000000-0000-0000-0000-000000000000', '9946aaa4-6be6-4878-a8ce-6eb654320a2e', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 12:45:41.237658+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc9ac9de-8e75-4a7f-b019-168f2cb334a1', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 13:43:49.729688+00', ''),
	('00000000-0000-0000-0000-000000000000', '6964a4a1-48e3-4ba7-91a9-b57cb83f7d41', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 13:43:49.730803+00', ''),
	('00000000-0000-0000-0000-000000000000', '896ab23f-9ff7-48d0-becc-3cd23b2f366b', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 14:41:58.530965+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a80f174d-dc82-4e80-b996-c45964f45b2c', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 14:41:58.532329+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfda0084-ea3a-46ca-94d4-940ed4ae7209', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 15:40:20.334644+00', ''),
	('00000000-0000-0000-0000-000000000000', '17329661-30ae-4094-969d-a9ae0242b4ab', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 15:40:20.335698+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bdd12351-39c5-4c8a-bee1-f76c8cc23568', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 16:38:21.918062+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fbb37ce6-1e4f-4245-82f8-c0594f1d6f2d', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 16:38:21.919674+00', ''),
	('00000000-0000-0000-0000-000000000000', '4cd0df92-b33c-403c-9894-e99a97e87722', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 17:36:23.339506+00', ''),
	('00000000-0000-0000-0000-000000000000', '7b8d2b70-46d3-455d-b4c1-da053fe4e471', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 17:36:23.34038+00', ''),
	('00000000-0000-0000-0000-000000000000', '6fd3c97f-c14e-436e-aa91-df939b3197e5', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 18:34:24.766506+00', ''),
	('00000000-0000-0000-0000-000000000000', '1bbb931f-2ac4-450c-9b5a-2b2ebbc46dd1', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 18:34:24.768217+00', ''),
	('00000000-0000-0000-0000-000000000000', '1d0cc6ea-17e7-4742-b2c6-317c9eb1ba3d', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 19:32:26.121782+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5b5e6ae-e9c7-4404-978d-ed1fd76d7487', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 19:32:26.123572+00', ''),
	('00000000-0000-0000-0000-000000000000', '7b214af5-ba05-40bb-b15f-07b0ae72c5c7', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 20:30:27.506687+00', ''),
	('00000000-0000-0000-0000-000000000000', '747be31d-9e79-4d73-a45a-a71eee168407', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 20:30:27.508729+00', ''),
	('00000000-0000-0000-0000-000000000000', '27dc0554-abdd-4b22-ba09-51066c907fb7', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 21:28:28.906277+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f27e390-0da2-4d69-b74f-f2f3af360076', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 21:28:28.907279+00', ''),
	('00000000-0000-0000-0000-000000000000', '81fef831-e290-497e-919f-cbf533b34216', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 22:26:30.355807+00', ''),
	('00000000-0000-0000-0000-000000000000', '992b2e34-64e4-4316-86d8-c5fa9f1bba3d', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 22:26:30.357295+00', ''),
	('00000000-0000-0000-0000-000000000000', '553bc651-493f-4175-9523-8971dddb76c0', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 23:24:45.219001+00', ''),
	('00000000-0000-0000-0000-000000000000', '6916664f-357e-48ff-9674-5f32a1f556d1', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-23 23:24:45.220814+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fcd22bb5-a9fc-49aa-93bd-2427d6bef8d5', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 00:16:43.163947+00', ''),
	('00000000-0000-0000-0000-000000000000', '58da1afc-17be-48ab-aa18-3f84bed63519', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 00:16:43.171252+00', ''),
	('00000000-0000-0000-0000-000000000000', '58df4d0f-5fe5-42ee-a2a3-8ad4fca1ccc2', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 01:13:28.119085+00', ''),
	('00000000-0000-0000-0000-000000000000', '6b51e97f-b801-433a-8a6e-6d835d54e43c', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 01:13:28.125816+00', ''),
	('00000000-0000-0000-0000-000000000000', '7192979c-c1ba-4aa0-8228-d76811ffb89e', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 02:11:37.844014+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f0bc23d-16f8-474c-bd76-05a35225765f', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 02:11:37.846026+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a40cf05-4cb8-46b9-b2fe-4b6f2625513f', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 03:09:53.092319+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba59c4be-1bcf-44b9-a073-164c3668a4ce', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 03:09:53.093848+00', ''),
	('00000000-0000-0000-0000-000000000000', '875579cc-2fea-4cf7-8a32-27e07fc858c6', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 04:07:54.386241+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f8864965-6f66-4ad6-9c26-90fc79776e66', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 04:07:54.388018+00', ''),
	('00000000-0000-0000-0000-000000000000', '91d06694-939a-4c86-ab54-a04651e3308f', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 05:05:55.733556+00', ''),
	('00000000-0000-0000-0000-000000000000', '972d1f77-f000-400c-aaf9-f5ea9a7cc074', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 05:05:55.73509+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e816a8cc-dcfe-4235-b462-8feb2882f3d7', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 06:03:57.266159+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e0c4c9a4-57de-4719-8b62-13a603d188a2', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 06:03:57.267907+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f3ff8f2c-2fba-4443-8ee1-ec2de51ef3f9', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 07:01:58.836162+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec889b01-76af-4e67-bd5d-5a87299fdb82', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 07:01:58.837063+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c3639c12-e26d-441c-a59c-5e0e605113ac', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 08:00:00.614047+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3724c98-e06f-4157-b19c-4a699ed695b5', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 08:00:00.615947+00', ''),
	('00000000-0000-0000-0000-000000000000', '78b6fff1-82ad-4656-8bca-d45c62b4abf0', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 08:58:01.831452+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a791ec1-3f03-4f02-8bb0-cc7565521953', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 08:58:01.833655+00', ''),
	('00000000-0000-0000-0000-000000000000', '53a8f4e9-3411-40d5-abab-9e4262b184db', '{"action":"token_refreshed","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 09:56:03.518755+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ab1fdbe-d43e-4a3c-82f5-3a4163b1b4b8', '{"action":"token_revoked","actor_id":"1453b12f-6050-4c12-8f5d-9f76b6b7073a","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-24 09:56:03.521397+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', 'authenticated', 'authenticated', 'rarira@gmail.com', NULL, '2024-10-23 05:32:17.274141+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-23 05:32:17.275454+00', '{"provider": "kakao", "providers": ["kakao"]}', '{"iss": "https://kauth.kakao.com", "sub": "3622146035", "name": "박인성", "email": "rarira@gmail.com", "picture": "https://k.kakaocdn.net/dn/bKtmuJ/btqAq8w5UdX/5KXg5IyYqaKjc2UztsbIX0/img_110x110.jpg", "provider_id": "3622146035", "email_verified": true, "phone_verified": false, "preferred_username": "박인성"}', NULL, '2024-10-23 05:32:17.261087+00', '2024-10-24 09:56:03.524377+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('3622146035', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', '{"iss": "https://kauth.kakao.com", "sub": "3622146035", "name": "박인성", "email": "rarira@gmail.com", "picture": "https://k.kakaocdn.net/dn/bKtmuJ/btqAq8w5UdX/5KXg5IyYqaKjc2UztsbIX0/img_110x110.jpg", "provider_id": "3622146035", "email_verified": true, "phone_verified": false, "preferred_username": "박인성"}', 'kakao', '2024-10-23 05:32:17.269606+00', '2024-10-23 05:32:17.269652+00', '2024-10-23 05:32:17.269652+00', '9137124a-fecb-4b27-99ac-3dad6a9b9905');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('e4b2d193-6c11-489f-b0ae-b1ea88960905', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', '2024-10-23 05:32:17.275497+00', '2024-10-24 09:56:03.525416+00', NULL, 'aal1', NULL, '2024-10-24 09:56:03.525379', 'cococom/1 CFNetwork/1568.100.1 Darwin/24.0.0', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('e4b2d193-6c11-489f-b0ae-b1ea88960905', '2024-10-23 05:32:17.279766+00', '2024-10-23 05:32:17.279766+00', 'oauth', 'f1539b61-e669-41da-a600-ad31293a3616');


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
	('00000000-0000-0000-0000-000000000000', 1, '1NoxgMbgbHv177PoBmafLw', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 05:32:17.276856+00', '2024-10-23 06:30:30.581678+00', NULL, 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 2, 'xSwal1EPfJ9AjmmOfo3SDA', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 06:30:30.584002+00', '2024-10-23 07:15:06.35317+00', '1NoxgMbgbHv177PoBmafLw', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 3, '2Uf4OQS_UIDle1N58E7QSA', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 07:15:06.35405+00', '2024-10-23 08:07:12.654824+00', 'xSwal1EPfJ9AjmmOfo3SDA', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 4, 'L16RHY2p1XD5-G0BAqS3GA', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 08:07:12.655936+00', '2024-10-23 08:57:20.834505+00', '2Uf4OQS_UIDle1N58E7QSA', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 5, 'D7_JYw6ApVSNZVxyOdr1kA', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 08:57:20.875381+00', '2024-10-23 09:51:14.538328+00', 'L16RHY2p1XD5-G0BAqS3GA', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 6, 'Gz9ucJDwL6Z-h1YmtCiD2w', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 09:51:14.539794+00', '2024-10-23 10:49:40.48841+00', 'D7_JYw6ApVSNZVxyOdr1kA', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 7, '7k-xVjFAFUqcJrPqBora7w', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 10:49:40.489131+00', '2024-10-23 11:47:41.894162+00', 'Gz9ucJDwL6Z-h1YmtCiD2w', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 8, 'Sab2qsqnH-n4TlrfZbpKTw', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 11:47:41.894826+00', '2024-10-23 12:45:41.237962+00', '7k-xVjFAFUqcJrPqBora7w', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 9, 'i1fdeIJPfL_TU5ismQRZBg', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 12:45:41.240233+00', '2024-10-23 13:43:49.731316+00', 'Sab2qsqnH-n4TlrfZbpKTw', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 10, 'tTO5Dtc-IGTEtSD-LVjOsA', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 13:43:49.732311+00', '2024-10-23 14:41:58.532644+00', 'i1fdeIJPfL_TU5ismQRZBg', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 11, 'e11qbtFdzEpmalVIQPxOdg', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 14:41:58.533328+00', '2024-10-23 15:40:20.335919+00', 'tTO5Dtc-IGTEtSD-LVjOsA', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 12, '2YNt46G2_ymlZaMU9RU6rQ', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 15:40:20.336824+00', '2024-10-23 16:38:21.92006+00', 'e11qbtFdzEpmalVIQPxOdg', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 13, 'CYvc5f1OXiVYCWLUAYTJag', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 16:38:21.920595+00', '2024-10-23 17:36:23.340675+00', '2YNt46G2_ymlZaMU9RU6rQ', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 14, 'fPw9VrTRfNVoHcULh3V3IQ', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 17:36:23.341237+00', '2024-10-23 18:34:24.768643+00', 'CYvc5f1OXiVYCWLUAYTJag', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 15, 'zZjg9CjA-2Fs5Rvcemyorw', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 18:34:24.769653+00', '2024-10-23 19:32:26.12421+00', 'fPw9VrTRfNVoHcULh3V3IQ', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 16, '26cPzihiZOj_ofnuNPBgdA', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 19:32:26.125019+00', '2024-10-23 20:30:27.509332+00', 'zZjg9CjA-2Fs5Rvcemyorw', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 17, 'AL-5AV66hE6gZ2Y_aYCDAQ', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 20:30:27.510589+00', '2024-10-23 21:28:28.908248+00', '26cPzihiZOj_ofnuNPBgdA', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 18, 'yq6cmcBkjUtrVm4GRvgGcg', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 21:28:28.909491+00', '2024-10-23 22:26:30.357629+00', 'AL-5AV66hE6gZ2Y_aYCDAQ', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 19, 'cUf05Fwou8XQqugFVfTMeA', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 22:26:30.359238+00', '2024-10-23 23:24:45.221245+00', 'yq6cmcBkjUtrVm4GRvgGcg', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 20, 'UCm1zZUs4mHTI8OnYVbp7w', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-23 23:24:45.222225+00', '2024-10-24 00:16:43.195474+00', 'cUf05Fwou8XQqugFVfTMeA', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 21, 'fnMyH03JW2W-xVU_dtwNAw', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-24 00:16:43.196849+00', '2024-10-24 01:13:28.127605+00', 'UCm1zZUs4mHTI8OnYVbp7w', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 22, 'iGBrOMr2C-5obC2NBTeAFQ', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-24 01:13:28.13677+00', '2024-10-24 02:11:37.846418+00', 'fnMyH03JW2W-xVU_dtwNAw', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 23, 'Hvb5p3QPpf9fOUmwU3i1Xg', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-24 02:11:37.847849+00', '2024-10-24 03:09:53.094075+00', 'iGBrOMr2C-5obC2NBTeAFQ', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 24, 'VOjXgDV6v2ZSCsFoR0Kbrw', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-24 03:09:53.095846+00', '2024-10-24 04:07:54.388361+00', 'Hvb5p3QPpf9fOUmwU3i1Xg', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 25, '9pPjWNMgiSQAQUBPYDw1Ng', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-24 04:07:54.389822+00', '2024-10-24 05:05:55.735514+00', 'VOjXgDV6v2ZSCsFoR0Kbrw', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 26, '0m9mdvBhKZVcxiiv6GN6Dw', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-24 05:05:55.737004+00', '2024-10-24 06:03:57.268245+00', '9pPjWNMgiSQAQUBPYDw1Ng', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 27, 'jS8eibbaVAwjS8ahfCjWbw', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-24 06:03:57.269892+00', '2024-10-24 07:01:58.837281+00', '0m9mdvBhKZVcxiiv6GN6Dw', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 28, 'Ma9xjXAIzmgXcKzs7GoOXg', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-24 07:01:58.838471+00', '2024-10-24 08:00:00.616334+00', 'jS8eibbaVAwjS8ahfCjWbw', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 29, 'iZSy6bycdJ-16fz6O_LFWQ', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-24 08:00:00.61765+00', '2024-10-24 08:58:01.833953+00', 'Ma9xjXAIzmgXcKzs7GoOXg', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 30, 'HD6-ZpgIN9CHtF6LKN_KMQ', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', true, '2024-10-24 08:58:01.835683+00', '2024-10-24 09:56:03.521966+00', 'iZSy6bycdJ-16fz6O_LFWQ', 'e4b2d193-6c11-489f-b0ae-b1ea88960905'),
	('00000000-0000-0000-0000-000000000000', 31, '2-iEUQqJn1kwoUEtIlsijA', '1453b12f-6050-4c12-8f5d-9f76b6b7073a', false, '2024-10-24 09:56:03.523281+00', '2024-10-24 09:56:03.523281+00', 'HD6-ZpgIN9CHtF6LKN_KMQ', 'e4b2d193-6c11-489f-b0ae-b1ea88960905');


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 31, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
