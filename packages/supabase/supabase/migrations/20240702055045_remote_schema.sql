
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

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" integer NOT NULL,
    "categoryName" character varying(100) NOT NULL
);

ALTER TABLE "public"."categories" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."discounts" (
    "id" integer NOT NULL,
    "itemId" "text" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "price" numeric(65,30) NOT NULL,
    "discount" numeric(65,30) NOT NULL,
    "discountPrice" numeric(65,30) NOT NULL,
    "discountHash" "text" NOT NULL
);

ALTER TABLE "public"."discounts" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."discounts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."discounts_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."discounts_id_seq" OWNED BY "public"."discounts"."id";

CREATE TABLE IF NOT EXISTS "public"."items" (
    "id" integer NOT NULL,
    "itemId" "text" NOT NULL,
    "itemName" "text",
    "categoryId" integer
);

ALTER TABLE "public"."items" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."items_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."items_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."items_id_seq" OWNED BY "public"."items"."id";

ALTER TABLE ONLY "public"."discounts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."discounts_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."items" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."items_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."discounts"
    ADD CONSTRAINT "discounts_discountHash_key1" UNIQUE ("discountHash");

ALTER TABLE ONLY "public"."discounts"
    ADD CONSTRAINT "discounts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_itemId_key1" UNIQUE ("itemId");

ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "discounts_discountHash_key" ON "public"."discounts" USING "btree" ("discountHash");

CREATE UNIQUE INDEX "items_itemId_key" ON "public"."items" USING "btree" ("itemId");

ALTER TABLE ONLY "public"."discounts"
    ADD CONSTRAINT "discounts_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("itemId") ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";

GRANT ALL ON TABLE "public"."discounts" TO "anon";
GRANT ALL ON TABLE "public"."discounts" TO "authenticated";
GRANT ALL ON TABLE "public"."discounts" TO "service_role";

GRANT ALL ON SEQUENCE "public"."discounts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."discounts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."discounts_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."items" TO "anon";
GRANT ALL ON TABLE "public"."items" TO "authenticated";
GRANT ALL ON TABLE "public"."items" TO "service_role";

GRANT ALL ON SEQUENCE "public"."items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."items_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
