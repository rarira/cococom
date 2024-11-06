--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 16.3 (Postgres.app)

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
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.profiles VALUES ('859133bf-bbea-4a0d-bf64-bf3023e718cb', '박인성', '2024-11-05 13:42:51.236112+00', true, 'rarira@gmail.com', true, true, 'https://k.kakaocdn.net/dn/bKtmuJ/btqAq8w5UdX/5KXg5IyYqaKjc2UztsbIX0/img_110x110.jpg');


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.comments VALUES (1, '2024-11-05 09:34:34.585785+00', 'ㄹㅂㅈㄹㄹㅈ', 189965, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (4, '2024-11-05 09:35:16.083454+00', 'ㅁㄴㄹㄴㄴ.  ㅇㅇ', 204857, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (10, '2024-11-05 10:44:30.68937+00', '2222', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (11, '2024-11-05 10:47:15.147647+00', '222', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (12, '2024-11-05 10:48:41.926919+00', '333', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (13, '2024-11-05 10:52:05.652+00', '444', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (14, '2024-11-05 10:58:48.122887+00', '555', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (15, '2024-11-05 11:08:48.261307+00', '666', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (16, '2024-11-05 11:10:18.540053+00', '666', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (17, '2024-11-05 11:16:38.407141+00', '777', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (18, '2024-11-05 11:20:24.320731+00', '888', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (19, '2024-11-05 11:20:24.94575+00', '888', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (20, '2024-11-05 11:23:24.66275+00', '999', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (21, '2024-11-05 11:30:08.475157+00', '101010', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (26, '2024-11-05 14:09:42.619991+00', '1616', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.comments VALUES (27, '2024-11-06 00:07:35.171393+00', '1244', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb');


--
-- Data for Name: memos; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.wishlists VALUES ('b2c3816c-e213-4f82-aa26-6da0715ef948', '2024-11-05 14:31:30.357425+00', 16021, '859133bf-bbea-4a0d-bf64-bf3023e718cb', '16021859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.wishlists VALUES ('fba65c3d-41d2-4565-a5a0-61a1026e90fb', '2024-11-05 14:31:32.287254+00', 14772, '859133bf-bbea-4a0d-bf64-bf3023e718cb', '14772859133bf-bbea-4a0d-bf64-bf3023e718cb');
INSERT INTO public.wishlists VALUES ('b074b3f1-e6e8-4302-9a40-2d43db04b18c', '2024-11-05 14:31:39.344703+00', 9051, '859133bf-bbea-4a0d-bf64-bf3023e718cb', '9051859133bf-bbea-4a0d-bf64-bf3023e718cb');


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 27, true);


--
-- Name: memos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.memos_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

