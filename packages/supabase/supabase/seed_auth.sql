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
	('00000000-0000-0000-0000-000000000000', '8b44811b-e0f7-4b47-96ad-535a625b93d1', '{"action":"user_signedup","actor_id":"72bbb79e-a744-46b3-8135-e42669bf6e15","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"kakao"}}', '2024-11-06 08:24:06.039413+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b8621bd-00e3-4507-9ae3-16bab7756601', '{"action":"user_signedup","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"kakao"}}', '2024-11-06 08:26:32.550964+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a09ac87-6f27-46e5-94e0-265f017149eb', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 09:25:01.736544+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a2ec5025-c003-4e9c-8714-a3ffad06d90c', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 09:25:01.737287+00', ''),
	('00000000-0000-0000-0000-000000000000', '37d75f1e-6e63-4e83-bee7-e60337394b32', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 10:23:01.918479+00', ''),
	('00000000-0000-0000-0000-000000000000', '36be343e-b915-4319-bc41-c414ca715f38', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 10:23:01.91907+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eaaccbb8-46ba-4ba3-b2c5-641405a6d0d5', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 11:21:02.110535+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd931a417-231d-4ef1-9fed-091fbb2e0529', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 11:21:02.111147+00', ''),
	('00000000-0000-0000-0000-000000000000', '42e9b3eb-d8de-4d29-b812-091610e25489', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 12:19:10.24168+00', ''),
	('00000000-0000-0000-0000-000000000000', '216a8282-1557-4315-9953-eed661e5f25c', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 12:19:10.242398+00', ''),
	('00000000-0000-0000-0000-000000000000', '1b0cddce-5ecf-4f74-ab1f-899745c90ca9', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 13:17:32.599911+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f7f8ce9f-d92c-46ff-8aa4-54f84190f7f8', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 13:17:32.600684+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba1f4b08-093a-4e8a-8d9d-eeef6c01c687', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 14:15:34.445621+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b20a461-8847-42b3-a959-c2759a7d24db', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 14:15:34.448238+00', ''),
	('00000000-0000-0000-0000-000000000000', '5bc4507c-3631-465c-8e68-5f339c8f6fa4', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 15:13:44.94495+00', ''),
	('00000000-0000-0000-0000-000000000000', '85acb18a-ae37-4c69-90db-9cbdc87c994c', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 15:13:44.945511+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b0b439b-b95a-432e-91a6-2b2045d0ee0c', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 16:11:55.015675+00', ''),
	('00000000-0000-0000-0000-000000000000', '83934201-a9cb-4b17-a29e-461e4cf856be', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 16:11:55.016351+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e38a409-a310-445c-9b4a-37437bd9fdee', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 17:09:55.240617+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ce9ac4e3-2aa3-40ee-96ca-8446efecfc5d', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 17:09:55.241295+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c3af91b0-8412-43de-9bcc-9ad9f290480c', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 18:08:34.971921+00', ''),
	('00000000-0000-0000-0000-000000000000', '0183351c-57e8-45f7-bc03-a5909cc3f821', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 18:08:34.972979+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b892757-d6d5-4a5c-a440-ecb2391b7406', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 19:06:50.390985+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b5b2aad-7687-4630-8495-2a1d17a0407d', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 19:06:50.391874+00', ''),
	('00000000-0000-0000-0000-000000000000', '664724bc-8cd5-43d6-b876-b231f4767524', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 20:05:36.232209+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a931629-8eb7-4de5-81c8-b5853ca88357', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 20:05:36.233272+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aaea97d8-1f68-4f90-9c78-8cb66858face', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 20:53:18.372797+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0e58070-3a6e-4861-8739-6a3fe53b0094', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 20:53:18.373474+00', ''),
	('00000000-0000-0000-0000-000000000000', '14d7d8a0-af80-4934-b3b9-13a447e36c92', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 21:41:30.697003+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd983bd21-30ea-40fd-8be9-6c7f0296a22a', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 21:41:30.697698+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb46a081-6cb3-4d60-870e-ef9fe20b0a25', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 22:39:56.047952+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f40331fd-720f-46ba-b985-adb97d280e14', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 22:39:56.04868+00', ''),
	('00000000-0000-0000-0000-000000000000', '7b49e191-9e06-4d1e-b479-0a865408da55', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 23:38:21.092194+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a1d7eab-38ab-43c3-9bc4-fe0b4b82b3dd', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-06 23:38:21.092938+00', ''),
	('00000000-0000-0000-0000-000000000000', '20d7910e-df97-4190-8543-6b81dd86a406', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 00:36:21.422954+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c1c8813-b5f6-4f16-8832-27831e3c2ecb', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 00:36:21.425112+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd00da9c5-dc0f-45c3-befb-519d53ef155e', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 01:34:25.480861+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f55dff4b-9121-4f75-bb28-e2ec5dbb9114', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 01:34:25.48153+00', ''),
	('00000000-0000-0000-0000-000000000000', 'df3572bd-42fc-4290-88be-d678b37a71d2', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 02:32:50.660469+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a19688d-cd36-45c0-b13b-f21c2a0783b3', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 02:32:50.661477+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bfc26b57-c17e-459c-897d-22fad8d05df9', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 03:31:04.404823+00', ''),
	('00000000-0000-0000-0000-000000000000', '4d37f432-c04a-409a-8d2c-f076d169f149', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 03:31:04.40605+00', ''),
	('00000000-0000-0000-0000-000000000000', '597b2bd3-c028-4a2b-bfdf-e81b4640b680', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 04:25:01.689268+00', ''),
	('00000000-0000-0000-0000-000000000000', '1665f814-ccb6-44aa-a80d-674a2282a4c2', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 04:25:01.693506+00', ''),
	('00000000-0000-0000-0000-000000000000', '736ed870-3964-423b-a410-96574d5a76d9', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 05:39:03.354001+00', ''),
	('00000000-0000-0000-0000-000000000000', '41cd5f6c-579a-4426-9c0e-693cdaddf24d', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 05:39:03.354771+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7035018-72a7-4472-b453-708c2802eee6', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 06:32:16.111732+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eb0eb545-f1d4-41dd-a016-bf7f0f7826b7', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 06:32:16.112808+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b0ceccde-3026-4775-b573-439d984249c2', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 07:30:45.590854+00', ''),
	('00000000-0000-0000-0000-000000000000', '50cf7b39-58ba-4d5b-a8e4-fe5dd2227314', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 07:30:45.5921+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ea030be-bdb2-409c-9f8c-533f5ab17456', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 08:33:23.475504+00', ''),
	('00000000-0000-0000-0000-000000000000', '1b57ae5c-7189-4abb-b6c2-1f1c7bef852d', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 08:33:23.477328+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be403724-3e11-48bb-ad0e-a8d44a4dc7e1', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 09:31:23.669427+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf63d5e3-e4cf-4f96-9358-25cab86c64d8', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 09:31:23.670549+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc60e927-5a36-4f61-bd5d-9d358de38fd7', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 10:17:06.50324+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc5e958a-9c7a-4c1b-a93c-1d6ec7544f09', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 10:17:06.504319+00', ''),
	('00000000-0000-0000-0000-000000000000', '54835899-b8f6-4bd1-baed-55be4eef1c87', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 11:15:16.822943+00', ''),
	('00000000-0000-0000-0000-000000000000', '2854d10b-05e9-405d-b112-3bfed14508ba', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 11:15:16.823847+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b5118cde-6280-4e34-bd3f-ad0927eb4895', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 12:13:17.035349+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f416d080-f39d-46d3-9ffb-3dbcd4a8aade', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 12:13:17.036078+00', ''),
	('00000000-0000-0000-0000-000000000000', '96e7518d-471c-4e84-ac39-a267b7befca4', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 13:11:17.272639+00', ''),
	('00000000-0000-0000-0000-000000000000', '42e7f453-f528-49c5-8545-ca70d154aea3', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 13:11:17.274693+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dce355f0-8500-46ba-8a91-5f7b22fbd459', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 14:09:30.579031+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a5fa0bf8-90e0-41c1-947c-8cfce14731b2', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 14:09:30.581369+00', ''),
	('00000000-0000-0000-0000-000000000000', '908b0d75-8108-4c3d-ad06-ec654952d342', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 15:07:53.710559+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c995a14e-b47c-40eb-90df-8c2169491b66', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 15:07:53.711274+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c486eeac-0eda-4703-889c-cd7c43356971', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 15:58:05.669478+00', ''),
	('00000000-0000-0000-0000-000000000000', '3375da0e-c770-4b58-9ba6-cf5b8a7b5813', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 15:58:05.670518+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec243fe1-69b7-4e9d-b18d-3f8240e7b360', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 16:51:59.29475+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f359f11-83b7-464f-bcf5-f94af4ebf72f', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 16:51:59.295835+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd1cca8eb-af17-4bce-a956-cf95d2e9dc8d', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 17:50:09.749847+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c86bb86-2d51-4b0b-8fd3-a8dc2c001a07', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 17:50:09.75097+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ce02377-70f3-4598-a98c-e0b2ebdcca2d', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 19:00:01.241073+00', ''),
	('00000000-0000-0000-0000-000000000000', '96112845-73a8-459c-9975-dae31a42f970', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 19:00:01.241795+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a8a20de4-729f-4086-b1d8-f3133a84a2c4', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 19:58:26.763202+00', ''),
	('00000000-0000-0000-0000-000000000000', '6a0f5fba-94cc-4931-9237-0d5da744a820', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 19:58:26.763808+00', ''),
	('00000000-0000-0000-0000-000000000000', '27f5a2c4-77c3-4b64-980f-ddd3458afbfa', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 20:49:58.499056+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5ed9f63-9743-4ad5-9c45-9e45d6379906', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 20:49:58.500559+00', ''),
	('00000000-0000-0000-0000-000000000000', '883859c0-2923-43c8-8e10-0dbfe77b20ab', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 21:44:28.407858+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cca688ff-2dd9-44c3-b73a-6b98fd5f7dc2', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 21:44:28.408865+00', ''),
	('00000000-0000-0000-0000-000000000000', '59ec41e5-2c4d-41f0-bcb6-45fa09da0aeb', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 22:29:11.093725+00', ''),
	('00000000-0000-0000-0000-000000000000', 'abb830db-14c5-4d00-beb5-748ceb4e9660', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 22:29:11.094744+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5d5a6d5-ea99-45d0-afe2-5d0bc01e4065', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 23:27:39.960976+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f4bf9da-3751-46eb-b3ab-65d19e4a8de7', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-07 23:27:39.962536+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cee522f1-479a-4ef2-ada1-25b93d76fcdd', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 00:22:40.162542+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cca41cca-76f3-4ef0-baff-a7686260d7c1', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 00:22:40.163353+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba0f69c6-e3f7-4784-b715-2c1a646180b6', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 01:20:42.150093+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd72e0efb-ce6e-4eda-902a-c5464359e334', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 01:20:42.150839+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eb416351-6688-4d2a-83eb-6c0c99354d2a', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 02:19:08.820241+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ab8e207-a400-483b-b2db-256db4ef1e51', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 02:19:08.821091+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c2615c27-26f2-4f64-b7a2-a2c4137e748c', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 03:17:09.063368+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fec6083d-5cd8-41e6-81d0-029d35c873a0', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 03:17:09.064175+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f784182d-13aa-4dc6-9938-178d67ba7663', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 04:15:09.294437+00', ''),
	('00000000-0000-0000-0000-000000000000', '51d8163d-5a90-4918-b484-4ff9efe3b6f9', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 04:15:09.29588+00', ''),
	('00000000-0000-0000-0000-000000000000', '369fb97b-6724-4508-89c1-136d35d7f2e3', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 05:13:19.073563+00', ''),
	('00000000-0000-0000-0000-000000000000', '938bac46-0f2a-4a29-ba74-4778395395fd', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 05:13:19.074731+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b23617ba-14de-41e6-b371-fdd89e51c145', '{"action":"token_refreshed","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 06:21:06.287166+00', ''),
	('00000000-0000-0000-0000-000000000000', '31f430af-9809-4c1c-9396-8ef949c966ff', '{"action":"token_revoked","actor_id":"bef9799f-cc23-4bf6-b41c-673f18558624","actor_username":"rarira@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-08 06:21:06.287996+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'bef9799f-cc23-4bf6-b41c-673f18558624', 'authenticated', 'authenticated', 'rarira@gmail.com', NULL, '2024-11-06 08:26:32.551527+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-11-06 08:26:32.552327+00', '{"provider": "kakao", "providers": ["kakao"]}', '{"iss": "https://kauth.kakao.com", "sub": "3622146035", "name": "박인성", "email": "rarira@gmail.com", "picture": "https://k.kakaocdn.net/dn/bKtmuJ/btqAq8w5UdX/5KXg5IyYqaKjc2UztsbIX0/img_110x110.jpg", "provider_id": "3622146035", "email_verified": true, "phone_verified": false, "preferred_username": "박인성"}', NULL, '2024-11-06 08:26:32.542366+00', '2024-11-08 06:21:06.28961+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('3622146035', 'bef9799f-cc23-4bf6-b41c-673f18558624', '{"iss": "https://kauth.kakao.com", "sub": "3622146035", "name": "박인성", "email": "rarira@gmail.com", "picture": "https://k.kakaocdn.net/dn/bKtmuJ/btqAq8w5UdX/5KXg5IyYqaKjc2UztsbIX0/img_110x110.jpg", "provider_id": "3622146035", "email_verified": true, "phone_verified": false, "preferred_username": "박인성"}', 'kakao', '2024-11-06 08:26:32.548084+00', '2024-11-06 08:26:32.548121+00', '2024-11-06 08:26:32.548121+00', '02f3a05d-8370-4008-8da1-c8cbc157b8c9');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('521dae96-698f-49e0-817d-38a859baa0c6', 'bef9799f-cc23-4bf6-b41c-673f18558624', '2024-11-06 08:26:32.552397+00', '2024-11-08 06:21:06.290478+00', NULL, 'aal1', NULL, '2024-11-08 06:21:06.290435', 'cococom/1 CFNetwork/1568.200.51 Darwin/24.1.0', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('521dae96-698f-49e0-817d-38a859baa0c6', '2024-11-06 08:26:32.554824+00', '2024-11-06 08:26:32.554824+00', 'oauth', 'a4fd38c9-766e-4330-925d-3086c6148d79');


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
	('00000000-0000-0000-0000-000000000000', 2, '6tzqcpEij6w_Jdu9mlcDAQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 08:26:32.553293+00', '2024-11-06 09:25:01.737561+00', NULL, '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 3, '8xqXhzB8GAIGB6tPrjcn1A', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 09:25:01.73846+00', '2024-11-06 10:23:01.919327+00', '6tzqcpEij6w_Jdu9mlcDAQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 4, 'y4WO6OHZE2SQq5zaFo4EZg', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 10:23:01.919664+00', '2024-11-06 11:21:02.111496+00', '8xqXhzB8GAIGB6tPrjcn1A', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 5, 'EpiR_2HgBvt7YAykrG4_6w', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 11:21:02.111968+00', '2024-11-06 12:19:10.242646+00', 'y4WO6OHZE2SQq5zaFo4EZg', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 6, 'ewzPNFvFQZ6oA1ZE38fkCg', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 12:19:10.242995+00', '2024-11-06 13:17:32.600897+00', 'EpiR_2HgBvt7YAykrG4_6w', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 7, 'xa7izSNnE9yfHQD42V3Zlg', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 13:17:32.601592+00', '2024-11-06 14:15:34.448756+00', 'ewzPNFvFQZ6oA1ZE38fkCg', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 8, 'azqeMVaVJPqPA0Rt9V_s4g', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 14:15:34.450533+00', '2024-11-06 15:13:44.945753+00', 'xa7izSNnE9yfHQD42V3Zlg', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 9, 'hxuGEO3aBRpzrFjxzkavkQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 15:13:44.946134+00', '2024-11-06 16:11:55.01658+00', 'azqeMVaVJPqPA0Rt9V_s4g', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 10, 'Nw2o0UmbzfsqXdgrxWA2ow', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 16:11:55.017047+00', '2024-11-06 17:09:55.241642+00', 'hxuGEO3aBRpzrFjxzkavkQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 11, '50BTIZGoz1HC_t0UrRBCYw', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 17:09:55.242103+00', '2024-11-06 18:08:34.973444+00', 'Nw2o0UmbzfsqXdgrxWA2ow', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 12, 'bgYJJLrSWufExRlUIQuR6w', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 18:08:34.974057+00', '2024-11-06 19:06:50.392207+00', '50BTIZGoz1HC_t0UrRBCYw', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 13, 'dqgQDtCniBscS48rINq9Cg', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 19:06:50.392647+00', '2024-11-06 20:05:36.233635+00', 'bgYJJLrSWufExRlUIQuR6w', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 14, '_7yjaR7kJyO1grb6OAoDfQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 20:05:36.234533+00', '2024-11-06 20:53:18.373665+00', 'dqgQDtCniBscS48rINq9Cg', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 15, 'i-St182n09cXEsko3Kxbng', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 20:53:18.374122+00', '2024-11-06 21:41:30.697909+00', '_7yjaR7kJyO1grb6OAoDfQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 16, 'sgULXD4ktxtHz3vM_efwoQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 21:41:30.698313+00', '2024-11-06 22:39:56.049084+00', 'i-St182n09cXEsko3Kxbng', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 17, 'yTMshTUfT8slzYQjuxmX-A', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 22:39:56.049649+00', '2024-11-06 23:38:21.093258+00', 'sgULXD4ktxtHz3vM_efwoQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 18, '1kSXUL6K9YmbOcQFNCA3Bw', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-06 23:38:21.093792+00', '2024-11-07 00:36:21.425562+00', 'yTMshTUfT8slzYQjuxmX-A', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 19, 'lNIyHiAmyW9MWNPg8fj3uA', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 00:36:21.426375+00', '2024-11-07 01:34:25.48173+00', '1kSXUL6K9YmbOcQFNCA3Bw', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 20, '2CIRbsfMHn1DDuccqbR64Q', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 01:34:25.482248+00', '2024-11-07 02:32:50.66171+00', 'lNIyHiAmyW9MWNPg8fj3uA', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 21, 'bEYcm06GA5VdkdZU7iXQtA', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 02:32:50.662232+00', '2024-11-07 03:31:04.406275+00', '2CIRbsfMHn1DDuccqbR64Q', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 22, 'GBvYLTjuUWJMmVyH5_9UKg', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 03:31:04.407117+00', '2024-11-07 04:25:01.693777+00', 'bEYcm06GA5VdkdZU7iXQtA', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 23, 'lm6dgQwrL0NyTzR0o91gfw', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 04:25:01.695605+00', '2024-11-07 05:39:03.354979+00', 'GBvYLTjuUWJMmVyH5_9UKg', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 24, 'I4AlXAaA5idl56eLbD7FeQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 05:39:03.355404+00', '2024-11-07 06:32:16.113145+00', 'lm6dgQwrL0NyTzR0o91gfw', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 25, 'WodRLAzVy67jx-81aJnt-g', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 06:32:16.113986+00', '2024-11-07 07:30:45.592335+00', 'I4AlXAaA5idl56eLbD7FeQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 26, 'L2P1FAfqujEEM51UvHx1hQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 07:30:45.593125+00', '2024-11-07 08:33:23.477607+00', 'WodRLAzVy67jx-81aJnt-g', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 27, 'c-E5OrWqDUeEg4znS5mu5A', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 08:33:23.482061+00', '2024-11-07 09:31:23.670773+00', 'L2P1FAfqujEEM51UvHx1hQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 28, 'kQKKUxXyPApCiIWHtP3rfQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 09:31:23.671288+00', '2024-11-07 10:17:06.504806+00', 'c-E5OrWqDUeEg4znS5mu5A', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 29, 'dWXKrj_ssAUXsNQi2GMlhA', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 10:17:06.505496+00', '2024-11-07 11:15:16.824241+00', 'kQKKUxXyPApCiIWHtP3rfQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 30, 'Vbh92cuSCytsO-kbOgLfFw', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 11:15:16.824805+00', '2024-11-07 12:13:17.037263+00', 'dWXKrj_ssAUXsNQi2GMlhA', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 31, 'vKoCzjbHxTQey-tU6HeOMQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 12:13:17.037797+00', '2024-11-07 13:11:17.275179+00', 'Vbh92cuSCytsO-kbOgLfFw', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 32, '9UDTZgcUe4C-H0loDYCBZQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 13:11:17.277477+00', '2024-11-07 14:09:30.581789+00', 'vKoCzjbHxTQey-tU6HeOMQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 33, 'U7NyFBVNjrf1Xk0_6Iu3_A', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 14:09:30.582348+00', '2024-11-07 15:07:53.711628+00', '9UDTZgcUe4C-H0loDYCBZQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 34, 'bc1khLm7Wneqa6r763gsZg', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 15:07:53.712217+00', '2024-11-07 15:58:05.670806+00', 'U7NyFBVNjrf1Xk0_6Iu3_A', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 35, 'S4Cn2v66ZkQw4szPTi0Z_w', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 15:58:05.671404+00', '2024-11-07 16:51:59.296146+00', 'bc1khLm7Wneqa6r763gsZg', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 36, 'hKsbJ9k-_MR2fiFU9iCrdA', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 16:51:59.296723+00', '2024-11-07 17:50:09.7513+00', 'S4Cn2v66ZkQw4szPTi0Z_w', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 37, 'ZKV1VLO7w7hZsH4b5197Cg', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 17:50:09.751826+00', '2024-11-07 19:00:01.242704+00', 'hKsbJ9k-_MR2fiFU9iCrdA', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 38, 'XqDPFee01_1Iu-7a8IHRSg', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 19:00:01.243311+00', '2024-11-07 19:58:26.763985+00', 'ZKV1VLO7w7hZsH4b5197Cg', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 39, 'YJOn6wdmOshVDFQUjXmKLA', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 19:58:26.764432+00', '2024-11-07 20:49:58.500859+00', 'XqDPFee01_1Iu-7a8IHRSg', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 40, 'jLXOPiStp4t9mDdxpuMUrA', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 20:49:58.501417+00', '2024-11-07 21:44:28.409236+00', 'YJOn6wdmOshVDFQUjXmKLA', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 41, 'mGz81GPycJ3VEjkVMUhEeQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 21:44:28.409865+00', '2024-11-07 22:29:11.095308+00', 'jLXOPiStp4t9mDdxpuMUrA', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 42, 'EHEZrDStAY38vWaQfBKMmA', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 22:29:11.095941+00', '2024-11-07 23:27:39.962992+00', 'mGz81GPycJ3VEjkVMUhEeQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 43, 'oKy_v6tLFdTT3iPHEICwfQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-07 23:27:39.963843+00', '2024-11-08 00:22:40.163637+00', 'EHEZrDStAY38vWaQfBKMmA', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 44, 'yPa_aMEl9dLGpgVPISBH8Q', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-08 00:22:40.164212+00', '2024-11-08 01:20:42.151249+00', 'oKy_v6tLFdTT3iPHEICwfQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 45, 'cfhgkh7CT2jYq_nFMlHxPQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-08 01:20:42.151813+00', '2024-11-08 02:19:08.82133+00', 'yPa_aMEl9dLGpgVPISBH8Q', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 46, 'rJdffUBfcFlgQJ32XqDhRg', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-08 02:19:08.821909+00', '2024-11-08 03:17:09.064366+00', 'cfhgkh7CT2jYq_nFMlHxPQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 47, 'okLyk6ZD34r5upSprtEvCQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-08 03:17:09.065037+00', '2024-11-08 04:15:09.296117+00', 'rJdffUBfcFlgQJ32XqDhRg', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 48, '9UbDEpa0fx0hdaU6LTw3Zw', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-08 04:15:09.29682+00', '2024-11-08 05:13:19.074911+00', 'okLyk6ZD34r5upSprtEvCQ', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 49, 'oGwghtLPGuQNVkzFRu2cCw', 'bef9799f-cc23-4bf6-b41c-673f18558624', true, '2024-11-08 05:13:19.075412+00', '2024-11-08 06:21:06.288245+00', '9UbDEpa0fx0hdaU6LTw3Zw', '521dae96-698f-49e0-817d-38a859baa0c6'),
	('00000000-0000-0000-0000-000000000000', 50, 'JHIj1HiJBr1qL4TPQAEaeQ', 'bef9799f-cc23-4bf6-b41c-673f18558624', false, '2024-11-08 06:21:06.288803+00', '2024-11-08 06:21:06.288803+00', 'oGwghtLPGuQNVkzFRu2cCw', '521dae96-698f-49e0-817d-38a859baa0c6');


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 50, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
