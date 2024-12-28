--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: delete_zero_quantity_stocks(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_zero_quantity_stocks() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if the quantity in the Stocks table is zero
    IF NEW."quantity" <= 0 THEN
        DELETE FROM "Stocks" WHERE "stockId" = NEW."stockId";
    END IF;

    -- Return the NEW record to continue with the operation
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.delete_zero_quantity_stocks() OWNER TO postgres;

--
-- Name: update_product_quantity(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_product_quantity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- If the record is related to a brick
    IF NEW."brickId" IS NOT NULL THEN
        -- Update the quantity in the Bricks table by adding the quantity in the Stocks table
        UPDATE "Bricks"
        SET "quantity" = "quantity" + NEW.quantity
        WHERE "brickId" = NEW."brickId";
    
    -- If the record is related to a set
    ELSIF NEW."setId" IS NOT NULL THEN
        -- Update the quantity in the Sets table by adding the quantity in the Stocks table
        UPDATE "Sets"
        SET "quantity" = "quantity" + NEW.quantity
        WHERE "setId" = NEW."setId";
    END IF;
    
    -- Return the NEW record so the insert operation continues
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_product_quantity() OWNER TO postgres;

--
-- Name: update_product_quantity_on_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_product_quantity_on_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- If the record is related to a brick
    IF OLD."brickId" IS NOT NULL THEN
        -- Update the quantity in the Bricks table by subtracting the quantity in the Stocks table
        UPDATE "Bricks"
        SET "quantity" = GREATEST("quantity" - OLD.quantity, 0)
        WHERE "brickId" = OLD."brickId";

    -- If the record is related to a set
    ELSIF OLD."setId" IS NOT NULL THEN
        -- Update the quantity in the Sets table by subtracting the quantity in the Stocks table
        UPDATE "Sets"
        SET "quantity" = GREATEST("quantity" - OLD.quantity, 0)
        WHERE "setId" = OLD."setId";
    END IF;

    -- Return the OLD record so the delete operation continues
    RETURN OLD;
END;
$$;


ALTER FUNCTION public.update_product_quantity_on_delete() OWNER TO postgres;

--
-- Name: update_product_quantity_on_edit(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_product_quantity_on_edit() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- If the record is related to a brick
    IF NEW."brickId" IS NOT NULL THEN
        -- Adjust the quantity in the Bricks table
        UPDATE "Bricks"
        SET "quantity" = "quantity" - OLD.quantity + NEW.quantity
        WHERE "brickId" = NEW."brickId";

    -- If the record is related to a set
    ELSIF NEW."setId" IS NOT NULL THEN
        -- Adjust the quantity in the Sets table
        UPDATE "Sets"
        SET "quantity" = "quantity" - OLD.quantity + NEW.quantity
        WHERE "setId" = NEW."setId";
    END IF;

    -- Return the NEW record to proceed with the update
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_product_quantity_on_edit() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Bricks; Type: TABLE; Schema: public; Owner: EdwardCamagong
--

CREATE TABLE public."Bricks" (
    "brickId" character varying(50) NOT NULL,
    "brickName" character varying(50) NOT NULL,
    "brickPrice" numeric NOT NULL,
    design bigint,
    category character varying,
    type character varying,
    quantity integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Bricks" OWNER TO "EdwardCamagong";

--
-- Name: Sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Sales" (
    id integer NOT NULL,
    quantity integer NOT NULL,
    tender numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    change numeric(10,2) NOT NULL,
    date date NOT NULL
);


ALTER TABLE public."Sales" OWNER TO postgres;

--
-- Name: Sales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Sales_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Sales_id_seq" OWNER TO postgres;

--
-- Name: Sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Sales_id_seq" OWNED BY public."Sales".id;


--
-- Name: Set_Brick; Type: TABLE; Schema: public; Owner: EdwardCamagong
--

CREATE TABLE public."Set_Brick" (
    "setId" character varying(7) NOT NULL,
    "brickId" character varying(15) NOT NULL
);


ALTER TABLE public."Set_Brick" OWNER TO "EdwardCamagong";

--
-- Name: Sets; Type: TABLE; Schema: public; Owner: EdwardCamagong
--

CREATE TABLE public."Sets" (
    "setId" character varying(50) NOT NULL,
    "setName" character varying(50) NOT NULL,
    "setDescription" text NOT NULL,
    "setPrice" numeric NOT NULL,
    theme character varying,
    pieces bigint,
    yr_release bigint,
    type character varying,
    quantity integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Sets" OWNER TO "EdwardCamagong";

--
-- Name: Stocks; Type: TABLE; Schema: public; Owner: EdwardCamagong
--

CREATE TABLE public."Stocks" (
    quantity bigint,
    "dateAdded" date NOT NULL,
    "expiryDate" date NOT NULL,
    "stockId" uuid DEFAULT gen_random_uuid() NOT NULL,
    "brickId" character varying(50),
    "setId" character varying(50)
);


ALTER TABLE public."Stocks" OWNER TO "EdwardCamagong";

--
-- Name: Users; Type: TABLE; Schema: public; Owner: EdwardCamagong
--

CREATE TABLE public."Users" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(100) NOT NULL
);


ALTER TABLE public."Users" OWNER TO "EdwardCamagong";

--
-- Name: Sales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sales" ALTER COLUMN id SET DEFAULT nextval('public."Sales_id_seq"'::regclass);


--
-- Data for Name: Bricks; Type: TABLE DATA; Schema: public; Owner: EdwardCamagong
--

COPY public."Bricks" ("brickId", "brickName", "brickPrice", design, category, type, quantity) FROM stdin;
302326	PLATE 1X2	2.95	3023	Plates	brick	0
6093525	SHAFT 3M Ø3.2	3.35	17715	Buildings & Furniture	brick	0
6103643	SUBMACHINE GUN Ø3.2 SHAFT	1.25	62885	Minifigure Acce0ssories	brick	0
6279875	CONNECTOR PEG W. FRICTION	1.24	61332	Connectors	brick	0
4114084	PLATE 2X2	0.90	3022	Plates	brick	0
379523	PLATE 2X6	2.3	3795	Plates	brick	0
4587840	FLAT TILE 1X3	5.01	63864	Plates	brick	0
6055065	PLATE W. BOW 1X2X2/3	4.23	11477	Bricks	brick	0
6092582	PLATE 1X2, W/ 1 KNOB	6.85	15573	Plates	brick	0
6189191	BRICK 1X2 W. 2 KNOBS	4.34	11211	Bricks	brick	0
6315291	PLATE 4X4 W/ANGLE	2.75	41822	Plates	brick	0
6315482	PLATE 1X2, ROUNDED, NO. 1	1.31	35480	Plates	brick	0
6333512	TILE 2X2, DEG. 90, W/ DEG. 45 CUT	9.32	27263	Plates	brick	0
4206482	CONN.BUSH W.FRIC./CROSSALE	4.23	43093	Connectors	brick	0
4210633	ROUND PLATE 1X1	8.31	6141	Plates	brick	0
4211042	PLATE 2X2 ROUND	4.61	4032	Plates	brick	0
4211133	PLATE 1X3	2.33	3623	Plates	brick	0
6152814	ROOF TILE 1X2X2/3, ABS NO. 6	3.54	26823	Bricks	brick	0
6360675	TRIGGER NO. 1	3.31	69755	Miscellaneous	brick	0
6461466	FIGURE ACCESSORIES	6.35	5194	Minifigure Accessories	brick	0
4286050	BRICK 1X1	2.31	3005	Bricks	brick	0
4211387	BRICK 2X2	2.32	3003	Bricks	brick	0
4211406	PLATE 2X8	2.32	3034	Plates	brick	0
4211438	PLATE 1X6	2.32	3666	Plates	brick	0
4650645	PROFILE BRICK Ø15.83 W. CROSS	0.03	92947	Bricks	brick	0
6028324	2X2 ROUND,SLOPE BRICK W. KNOB	0.02	98100	Bricks	brick	0
6345639	PLATE 1X1, W/ 1.5 PLATE 1X2 UPWARDS	0.05	73825	Plates	brick	0
6447202	MINI HEAD, NO. 4154	2.50	104619	Minifigure Parts	brick	0
6345952	PLATE 1X2, W/ SHOOTER, NO. 1	0.2	69754	Miscellaneous	brick	0
6245250	ROOF TILE 1X1X2/3	0.01	35338	Bricks	brick	0
6514007	PLATE 1X2	0.01	28653	Plates	brick	0
6245302	PARABOLIC ELEMENT Ø16	0.01	35395	Plates	brick	0
302401	PLATE 1X1	0.01	3024	Plates	brick	0
370101	TECHNIC BRICK 1X4, Ø4,9	0.02	3701	Bricks	brick	0
379501	PLATE 2X6	0.01	3795	Plates	brick	0
403201	PLATE 2X2 ROUND	0.01	4032	Plates	brick	0
4504369	ROOF TILE 1X1X2/3, ABS	0.01	54200	Bricks	brick	0
6034044	PLATE W. BOW 1X2X2/3	0.2	11477	Bricks	brick	0
6097637	ANGULAR PLATE 1.5 BOT. 1X2 2/2	0.02	99207	Plates	brick	0
6218899	BRICK 2X2 ROUND WITH HOLE Ø4,85	0.02	17485	Bricks	brick	0
6250591	FLAT TILE 1X1, 1/2 CIRCLE	0.01	35399	Plates	brick	0
6447201	MINI HELMET, NO. 433	3.99	104618	Minifigure Accessories	brick	0
6447206	MINI LOWER PART, NO. 2554	3.69	104623	Minifigure Parts	brick	0
6461160	MINI UPPER PART, NO. 6828	4.23	76382	Minifigure Parts	brick	0
362301	PLATE 1X3	0.01	3623	Plates	brick	19
6347715	TECHNIC 3 W.ARCH W.KNOB AND SHAFT ø3.2	0.01	42456	Miscellaneous	brick	0
6137926	BRICK 2x2 W. ANGLE 45 DEGREES	0.03	87620	Bricks	brick	0
6357598	BRICK 1X3, OUTSIDE HALF ARCH, W/ CUTOUT	0.14	70681	Bricks	brick	0
300501	BRICK 1X1	0.01	3005	Bricks	brick	142
6514189	FLAT TILE 1X1, ROUND	0.01	35380	Plates	brick	37
\.


--
-- Data for Name: Sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Sales" (id, quantity, tender, total, change, date) FROM stdin;
1	2	123.45	43.21	123.00	2024-12-18
2	5	10599.33	10599.19	0.14	2024-12-18
3	11	110000.00	109999.89	0.11	2024-12-18
4	5	30299.57	30299.57	0.00	2024-12-19
5	5	30299.57	30299.57	0.00	2024-12-19
6	5	30299.57	30299.57	0.00	2024-12-19
7	5	30299.57	30299.57	0.00	2024-12-19
8	5	30299.57	30299.57	0.00	2024-12-19
9	5	30299.57	30299.57	0.00	2024-12-19
10	4	39999.96	39999.96	0.00	2024-12-19
11	2	19999.98	19999.98	0.00	2024-12-19
12	3	29999.97	29999.97	0.00	2024-12-19
13	2	0.02	0.02	0.00	2024-12-19
14	5	200.00	170.01	29.99	2024-12-20
15	5	59999.95	49999.95	10000.00	2024-12-20
16	5	49999.95	49999.95	0.00	2024-12-20
17	11	1010000.00	109999.89	900000.11	2024-12-20
18	20	1100.00	1094.86	5.14	2024-12-20
19	2	100.00	85.00	15.00	2024-12-20
20	25	23000.75	2124.75	20876.00	2024-12-21
\.


--
-- Data for Name: Set_Brick; Type: TABLE DATA; Schema: public; Owner: EdwardCamagong
--

COPY public."Set_Brick" ("setId", "brickId") FROM stdin;
75391-1	6279875
75391-1	4114084
75391-1	379523
75391-1	4587840
75391-1	6055065
75391-1	6092582
75391-1	6189191
75391-1	6315291
75391-1	6315482
75391-1	6333512
75391-1	4206482
75391-1	4210633
75391-1	4211042
75391-1	4211133
75391-1	6152814
75391-1	6360675
75391-1	6461466
75391-1	4286050
75391-1	4211387
75391-1	4211406
75391-1	4211438
75391-1	4650645
75391-1	6028324
75391-1	6345639
75391-1	6347715
75391-1	6447202
75391-1	6345952
75391-1	6245250
75391-1	6514007
75391-1	6245302
75391-1	6514189
75391-1	300501
75391-1	302401
75391-1	362301
75391-1	370101
75391-1	379501
75391-1	403201
75391-1	4504369
75391-1	6034044
75391-1	6097637
75391-1	6137926
75391-1	6218899
75391-1	6250591
75391-1	6357598
75391-1	6447201
75391-1	6447206
75391-1	6461160
\.


--
-- Data for Name: Sets; Type: TABLE DATA; Schema: public; Owner: EdwardCamagong
--

COPY public."Sets" ("setId", "setName", "setDescription", "setPrice", theme, pieces, yr_release, type, quantity) FROM stdin;
75391-1	Captain Rex Y-wing Microfighter	Fantastic, quick-build LEGO® Star Wars™ starship for kids\nLet kids team up with a popular Star Wars: The Clone Wars character on playtime missions with this LEGO® brick-built Captain Rex Y-Wing Microfighter (75391) starship toy. A fun fantasy gift idea for creative boys, girls and any young fan aged 6 and up, this buildable vehicle toy playset features the first-ever LEGO Star Wars™ construction model of Captain Rex’s Y-wing. Designed to be easy to build so the action starts fast, this miniature version of the iconic Star Wars starfighter has a minifigure cockpit and 2 stud shooters, and the included Captain Rex LEGO minifigure comes with 2 blasters.	12.99	Star Wars	99	2024	set	23
11111111111111111111111111111111111111111111111111	11111111111111111111111111111111111111111111111111	123	9999.99	123	123	123	set	666
321	32	32	12	32	12	12	set	0
12345	123	213	123	213	123	123	set	0
75347-1	TIE Bomber	Star Wars: The Empire Strikes Back fans will love this buildable toy playset, featuring a torpedo-dropping TIE Bomber and 3 LEGO® minifigures.\nStar Wars: The Empire Strikes Back fans can play out Imperial missions to defeat the Rebel Alliance with this LEGO® brick-built TIE Bomber (75347) starfighter toy. It features an opening minifigure cockpit, a torpedo-dropping function and 2 stud shooters. A top gift idea for Star Wars™ fans aged 9 and up, this action-packed, buildable toy playset also includes Darth Vader, Vice Admiral Sloane and TIE Bomber Pilot LEGO minifigures with weapons, plus a Gonk Droid LEGO figure and a cart to transport torpedoes to the TIE Bomber.	84.99	Star Wars	625	2023	set	0
1232	123	123	123	123	123	123	set	0
75394-1	Imperial Star Destroyer	Kids’ buildable starship toy for playful adventures\n\nDominate the galaxy with this LEGO® Star Wars™ Imperial Star Destroyer buildable toy starship playset for kids (75394). A cool birthday gift for boys, girls and fans aged 10 and up, this Star Wars starship building toy features a hidden foldout carry handle for flying and 2 spring-loaded shooters, with a lift-off top panel and foldout side panels for easy access to the detailed interior. Playful details inside include the bridge, command room, break room, armory, control panels and cargo box with thermal detonator elements.\n\nThis brick-built Star Wars vehicle toy comes with 7 LEGO Star Wars minifigures, including Darth Vader, Commander Praji and a special LEGO Star Wars 25th anniversary minifigure of Cal Kestis, plus lots of accessories to recreate Star Wars: A New Hope adventures.	299.59	Star Wars	1555	2024	set	41
\.


--
-- Data for Name: Stocks; Type: TABLE DATA; Schema: public; Owner: EdwardCamagong
--

COPY public."Stocks" (quantity, "dateAdded", "expiryDate", "stockId", "brickId", "setId") FROM stdin;
41	2024-12-12	2024-12-25	3beadd4a-ff81-4146-807b-73e51b7fe864	\N	75394-1
23	2024-12-19	2024-12-25	89b9b7d6-0dc4-4b16-b34d-abf99b5b54e7	\N	75391-1
19	2024-12-19	2024-12-25	5e2284d0-5b25-4d1c-bc4a-9754c26272de	362301	\N
142	2024-12-19	2024-12-26	93f2966c-a2c5-4754-8dfa-0bc32a1ccd0a	300501	\N
37	2024-12-18	2024-12-25	de075bc9-764c-4471-b6de-4d75f437f314	6514189	\N
666	2024-12-20	2024-12-26	f2bcaea7-7975-408a-901f-a6a2e721256c	\N	11111111111111111111111111111111111111111111111111
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: EdwardCamagong
--

COPY public."Users" (id, name, username, password) FROM stdin;
42fe5e2e-3263-4610-b807-162ac05d56c4	Djikstra	shortest123	12345
4bf3cda1-afe3-473d-84ca-1fe637142fa1	sample	sample	sample
076baf77-3feb-490a-b487-0a712356e7d7	Wiplash123	aespa	123
3a0845e6-4af1-40d5-a18d-35552af2f690	admin	admin	admin
\.


--
-- Name: Sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Sales_id_seq"', 20, true);


--
-- Name: Bricks Bricks_pkey; Type: CONSTRAINT; Schema: public; Owner: EdwardCamagong
--

ALTER TABLE ONLY public."Bricks"
    ADD CONSTRAINT "Bricks_pkey" PRIMARY KEY ("brickId");


--
-- Name: Sales Sales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_pkey" PRIMARY KEY (id);


--
-- Name: Sets Sets_pkey; Type: CONSTRAINT; Schema: public; Owner: EdwardCamagong
--

ALTER TABLE ONLY public."Sets"
    ADD CONSTRAINT "Sets_pkey" PRIMARY KEY ("setId");


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: EdwardCamagong
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Users no dupe; Type: CONSTRAINT; Schema: public; Owner: EdwardCamagong
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "no dupe" UNIQUE (name, username);


--
-- Name: Stocks stocks_pkey; Type: CONSTRAINT; Schema: public; Owner: EdwardCamagong
--

ALTER TABLE ONLY public."Stocks"
    ADD CONSTRAINT stocks_pkey PRIMARY KEY ("stockId");


--
-- Name: Stocks after_stock_update; Type: TRIGGER; Schema: public; Owner: EdwardCamagong
--

CREATE TRIGGER after_stock_update AFTER UPDATE OF quantity ON public."Stocks" FOR EACH ROW EXECUTE FUNCTION public.update_product_quantity_on_edit();


--
-- Name: Stocks check_zero_quantity; Type: TRIGGER; Schema: public; Owner: EdwardCamagong
--

CREATE TRIGGER check_zero_quantity AFTER INSERT OR UPDATE ON public."Stocks" FOR EACH ROW EXECUTE FUNCTION public.delete_zero_quantity_stocks();


--
-- Name: Stocks decrease_quantity_on_delete; Type: TRIGGER; Schema: public; Owner: EdwardCamagong
--

CREATE TRIGGER decrease_quantity_on_delete AFTER DELETE ON public."Stocks" FOR EACH ROW EXECUTE FUNCTION public.update_product_quantity_on_delete();


--
-- Name: Stocks stock_addition_trigger; Type: TRIGGER; Schema: public; Owner: EdwardCamagong
--

CREATE TRIGGER stock_addition_trigger AFTER INSERT ON public."Stocks" FOR EACH ROW EXECUTE FUNCTION public.update_product_quantity();


--
-- Name: Stocks Stocks_brickId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: EdwardCamagong
--

ALTER TABLE ONLY public."Stocks"
    ADD CONSTRAINT "Stocks_brickId_fkey" FOREIGN KEY ("brickId") REFERENCES public."Bricks"("brickId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Stocks Stocks_setId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: EdwardCamagong
--

ALTER TABLE ONLY public."Stocks"
    ADD CONSTRAINT "Stocks_setId_fkey" FOREIGN KEY ("setId") REFERENCES public."Sets"("setId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

