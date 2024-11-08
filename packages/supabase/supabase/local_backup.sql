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

INSERT INTO public.profiles VALUES ('bef9799f-cc23-4bf6-b41c-673f18558624', '박인성', '2024-11-06 17:26:32.539762+00', true, 'rarira@gmail.com', true, true, 'https://k.kakaocdn.net/dn/bKtmuJ/btqAq8w5UdX/5KXg5IyYqaKjc2UztsbIX0/img_110x110.jpg');


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.comments VALUES (28, '2024-11-06 11:47:47.995395+00', '1133', 187354, 'bef9799f-cc23-4bf6-b41c-673f18558624');
INSERT INTO public.comments VALUES (30, '2024-11-06 11:48:14.955661+00', '4443', 204029, 'bef9799f-cc23-4bf6-b41c-673f18558624');
INSERT INTO public.comments VALUES (31, '2024-11-06 23:50:14.836645+00', '12443', 187437, 'bef9799f-cc23-4bf6-b41c-673f18558624');
INSERT INTO public.comments VALUES (32, '2024-11-07 03:19:46.199819+00', 'qwddd', 99671, 'bef9799f-cc23-4bf6-b41c-673f18558624');
INSERT INTO public.comments VALUES (35, '2024-11-07 14:21:24.918549+00', 'comment', 14772, 'bef9799f-cc23-4bf6-b41c-673f18558624');


--
-- Data for Name: memos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.memos VALUES (1, '2024-11-06 12:48:06.688535+00', 'bef9799f-cc23-4bf6-b41c-673f18558624', 202197, 'asfasfdd', '2024-11-06 12:48:06.688535+00');
INSERT INTO public.memos VALUES (2, '2024-11-06 12:48:11.818087+00', 'bef9799f-cc23-4bf6-b41c-673f18558624', 202197, 'gaasdd', '2024-11-06 12:48:11.818087+00');
INSERT INTO public.memos VALUES (5, '2024-11-06 23:48:19.014699+00', 'bef9799f-cc23-4bf6-b41c-673f18558624', 99671, 'dq1233', '2024-11-06 23:48:19.014699+00');
INSERT INTO public.memos VALUES (17, '2024-11-07 04:05:25.416692+00', 'bef9799f-cc23-4bf6-b41c-673f18558624', 99671, 'dasdd', '2024-11-07 04:05:25.416692+00');
INSERT INTO public.memos VALUES (18, '2024-11-07 07:07:13.34215+00', 'bef9799f-cc23-4bf6-b41c-673f18558624', 178402, '1233', '2024-11-07 07:07:13.34215+00');
INSERT INTO public.memos VALUES (19, '2024-11-07 07:13:03.046579+00', 'bef9799f-cc23-4bf6-b41c-673f18558624', 178402, '222', '2024-11-07 07:13:03.046579+00');
INSERT INTO public.memos VALUES (20, '2024-11-07 07:14:37.031415+00', 'bef9799f-cc23-4bf6-b41c-673f18558624', 202197, '333', '2024-11-07 07:14:37.031415+00');
INSERT INTO public.memos VALUES (21, '2024-11-07 07:17:02.120773+00', 'bef9799f-cc23-4bf6-b41c-673f18558624', 202197, '4444', '2024-11-07 07:17:02.120773+00');
INSERT INTO public.memos VALUES (22, '2024-11-07 07:30:37.449595+00', 'bef9799f-cc23-4bf6-b41c-673f18558624', 202730, '111', '2024-11-07 07:30:37.449595+00');


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.wishlists VALUES ('447751ce-aae1-470d-ad9c-7b6745836dad', '2024-11-06 12:17:44.787946+00', 187354, 'bef9799f-cc23-4bf6-b41c-673f18558624', '187354bef9799f-cc23-4bf6-b41c-673f18558624');
INSERT INTO public.wishlists VALUES ('ef054acc-9361-4019-877d-39266e70e53a', '2024-11-07 14:00:31.598828+00', 14772, 'bef9799f-cc23-4bf6-b41c-673f18558624', '14772bef9799f-cc23-4bf6-b41c-673f18558624');


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 35, true);


--
-- Name: memos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.memos_id_seq', 28, true);


--
-- PostgreSQL database dump complete
--

