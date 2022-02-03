--
-- PostgreSQL database dump
--

-- Dumped from database version 13.5
-- Dumped by pg_dump version 13.5

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
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

-- CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: -
--

-- COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_user_groups_id_seq OWNED BY public.auth_user_groups.id;


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_user_id_seq OWNED BY public.auth_user.id;


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_user_user_permissions_id_seq OWNED BY public.auth_user_user_permissions.id;


--
-- Name: chat_city; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_city (
    id bigint NOT NULL,
    name character varying(25) NOT NULL,
    "roomNum" integer NOT NULL,
    "femaleNumForMale" integer NOT NULL,
    "maleNumForFemale" integer NOT NULL,
    "femaleNumForFemale" integer NOT NULL,
    "maleNumForMale" integer NOT NULL
);


--
-- Name: chat_city_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_city_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_city_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_city_id_seq OWNED BY public.chat_city.id;


--
-- Name: chat_dialogue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_dialogue (
    id bigint NOT NULL,
    dialog jsonb,
    action character varying(10) NOT NULL,
    sub character varying(10),
    number integer NOT NULL,
    game_id bigint
);


--
-- Name: chat_dialogue_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_dialogue_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_dialogue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_dialogue_id_seq OWNED BY public.chat_dialogue.id;


--
-- Name: chat_game; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_game (
    id bigint NOT NULL,
    name character varying(30) NOT NULL,
    "isAdult" boolean NOT NULL,
    "isHetero" boolean NOT NULL,
    best_ratio jsonb NOT NULL,
    threshold_ratio jsonb NOT NULL,
    game_id character varying(25) NOT NULL,
    story jsonb
);


--
-- Name: chat_game_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_game_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_game_id_seq OWNED BY public.chat_game.id;


--
-- Name: chat_gameevent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_gameevent (
    id bigint NOT NULL,
    name character varying(30) NOT NULL,
    content text,
    "group" integer NOT NULL,
    game_id bigint
);


--
-- Name: chat_gameevent_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_gameevent_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_gameevent_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_gameevent_id_seq OWNED BY public.chat_gameevent.id;


--
-- Name: chat_gamerole; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_gamerole (
    id bigint NOT NULL,
    name character varying(25) NOT NULL,
    gender character varying(1),
    game_id bigint,
    "group" integer NOT NULL
);


--
-- Name: chat_match; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_match (
    id bigint NOT NULL,
    player_list jsonb,
    room_id bigint
);


--
-- Name: chat_match_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_match_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_match_id_seq OWNED BY public.chat_match.id;


--
-- Name: chat_photo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_photo (
    id bigint NOT NULL,
    image character varying(100) NOT NULL,
    upload_date timestamp with time zone NOT NULL,
    uploader character varying(32),
    "isForAdult" boolean NOT NULL
);


--
-- Name: chat_photo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_photo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_photo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_photo_id_seq OWNED BY public.chat_photo.id;


--
-- Name: chat_player; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_player (
    uuid uuid NOT NULL,
    name character varying(25),
    create_date timestamp with time zone NOT NULL,
    "isBanned" boolean NOT NULL,
    room_id bigint,
    waiting_time timestamp with time zone,
    status integer NOT NULL,
    "imgUrl_adult" character varying(200),
    user_id integer,
    gender character varying(1),
    tag_int integer,
    "isAdult" boolean,
    "isHetero" boolean,
    game_id character varying(25),
    "isPrepared" boolean NOT NULL,
    tag_json jsonb,
    "isOn" boolean NOT NULL,
    match_id bigint,
    city_id character varying(25)
);


--
-- Name: chat_role_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_role_id_seq OWNED BY public.chat_gamerole.id;


--
-- Name: chat_room; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_room (
    id bigint NOT NULL,
    game_id bigint,
    onoff_dict jsonb,
    player_dict jsonb,
    create_date timestamp with time zone NOT NULL,
    answer jsonb,
    city_id character varying(25)
);


--
-- Name: chat_room_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_room_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_room_id_seq OWNED BY public.chat_room.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


--
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- Name: auth_user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user ALTER COLUMN id SET DEFAULT nextval('public.auth_user_id_seq'::regclass);


--
-- Name: auth_user_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups ALTER COLUMN id SET DEFAULT nextval('public.auth_user_groups_id_seq'::regclass);


--
-- Name: auth_user_user_permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_user_user_permissions_id_seq'::regclass);


--
-- Name: chat_city id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_city ALTER COLUMN id SET DEFAULT nextval('public.chat_city_id_seq'::regclass);


--
-- Name: chat_dialogue id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_dialogue ALTER COLUMN id SET DEFAULT nextval('public.chat_dialogue_id_seq'::regclass);


--
-- Name: chat_game id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_game ALTER COLUMN id SET DEFAULT nextval('public.chat_game_id_seq'::regclass);


--
-- Name: chat_gameevent id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_gameevent ALTER COLUMN id SET DEFAULT nextval('public.chat_gameevent_id_seq'::regclass);


--
-- Name: chat_gamerole id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_gamerole ALTER COLUMN id SET DEFAULT nextval('public.chat_role_id_seq'::regclass);


--
-- Name: chat_match id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_match ALTER COLUMN id SET DEFAULT nextval('public.chat_match_id_seq'::regclass);


--
-- Name: chat_photo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_photo ALTER COLUMN id SET DEFAULT nextval('public.chat_photo_id_seq'::regclass);


--
-- Name: chat_room id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_room ALTER COLUMN id SET DEFAULT nextval('public.chat_room_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add user	4	add_user
14	Can change user	4	change_user
15	Can delete user	4	delete_user
16	Can view user	4	view_user
17	Can add content type	5	add_contenttype
18	Can change content type	5	change_contenttype
19	Can delete content type	5	delete_contenttype
20	Can view content type	5	view_contenttype
21	Can add session	6	add_session
22	Can change session	6	change_session
23	Can delete session	6	delete_session
24	Can view session	6	view_session
25	Can add question	7	add_question
26	Can change question	7	change_question
27	Can delete question	7	delete_question
28	Can view question	7	view_question
29	Can add room	8	add_room
30	Can change room	8	change_room
31	Can delete room	8	delete_room
32	Can view room	8	view_room
33	Can add player	9	add_player
34	Can change player	9	change_player
35	Can delete player	9	delete_player
36	Can view player	9	view_player
37	Can add photo	10	add_photo
38	Can change photo	10	change_photo
39	Can delete photo	10	delete_photo
40	Can view photo	10	view_photo
41	Can add school	11	add_school
42	Can change school	11	change_school
43	Can delete school	11	delete_school
44	Can view school	11	view_school
45	Can add dialogue	12	add_dialogue
46	Can change dialogue	12	change_dialogue
47	Can delete dialogue	12	delete_dialogue
48	Can view dialogue	12	view_dialogue
49	Can add robot	13	add_robot
50	Can change robot	13	change_robot
51	Can delete robot	13	delete_robot
52	Can view robot	13	view_robot
53	Can add game	14	add_game
54	Can change game	14	change_game
55	Can delete game	14	delete_game
56	Can view game	14	view_game
57	Can add role	15	add_role
58	Can change role	15	change_role
59	Can delete role	15	delete_role
60	Can view role	15	view_role
61	Can add game role	15	add_gamerole
62	Can change game role	15	change_gamerole
63	Can delete game role	15	delete_gamerole
64	Can view game role	15	view_gamerole
65	Can add game event	16	add_gameevent
66	Can change game event	16	change_gameevent
67	Can delete game event	16	delete_gameevent
68	Can view game event	16	view_gameevent
69	Can add match	17	add_match
70	Can change match	17	change_match
71	Can delete match	17	delete_match
72	Can view match	17	view_match
73	Can add city	18	add_city
74	Can change city	18	change_city
75	Can delete city	18	delete_city
76	Can view city	18	view_city
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
26	pbkdf2_sha256$260000$LQ4GjUpStbRqaBJnCloNkI$Iw1dfnc4Z2+KY0z4dLqRuhPRvT6/J+B4bzNSLb0UwQ0=	2022-01-20 14:04:31.361+08	f	kfc9594@yahoo.com.tw0			kfc9594@yahoo.com.tw	f	t	2021-12-02 15:29:08.775+08
28	pbkdf2_sha256$260000$Mu95YA4zUSPLU6GcNwBcoD$jVHXVIqsEw95ulRp1r9cFX26KcPFfvU3uBHrcsqaWfU=	2022-01-20 22:34:02.361+08	f	kfc9594@yahoo.com.tw1			kfc9594@yahoo.com.tw	f	t	2021-12-02 17:30:56.592+08
29	pbkdf2_sha256$260000$cWlDBo5jfUqMU3zxv2Pq71$ey5Ldzs8nT4ykzt00+VzPMtB7LDSudjUFmw60CXiQO0=	2022-01-20 11:17:20.037+08	f	kfc9594@yahoo.com.tw2			kfc9594@yahoo.com.tw	f	t	2021-12-02 18:02:31.256+08
30	pbkdf2_sha256$260000$MCnZ5UMsZpgmmBJaTeucjI$oZieq/46zTWdvrjqCWdEESEIoX0MV8zHuacsfEwtwpk=	2022-01-14 10:11:03.843+08	t	jason959493@gmail.com			jason959493@gmail.com	t	t	2021-12-10 13:56:02.88+08
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: chat_city; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_city (id, name, "roomNum", "femaleNumForMale", "maleNumForFemale", "femaleNumForFemale", "maleNumForMale") FROM stdin;
1	null	0	0	0	0	0
2	Matsu	0	0	0	0	0
3	Kinmen	0	0	0	0	0
4	Taipei	0	0	0	0	0
5	New_Taipei	0	0	0	0	0
6	Keelung	0	0	0	0	0
7	Taoyuan	0	0	0	0	0
8	Taichung	0	0	0	0	0
9	Tainan	0	0	0	0	0
10	Kaohsiung	0	0	0	0	0
11	Hsinchu	0	0	0	0	0
12	Miaoli	0	0	0	0	0
13	Nantou	0	0	0	0	0
14	Changhua	0	0	0	0	0
15	Yunlin	0	0	0	0	0
16	Hualien	0	0	0	0	0
17	Taitung	0	0	0	0	0
18	Penghu	0	0	0	0	0
19	Green_Island	0	0	0	0	0
20	Orchid_Island	0	0	0	0	0
21	Pingtung	0	0	0	0	0
22	Chiayi	0	0	0	0	0
23	Yilan	0	0	0	0	0
\.


--
-- Data for Name: chat_dialogue; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_dialogue (id, dialog, action, sub, number, game_id) FROM stdin;
7	["我的朋友 現在上線也太早了吧！", 0]	GREET	t05-08	1	\N
8	["歡迎所有早上蹺課蹺班的朋友～", 0]	GREET	t08-12	1	\N
9	["下午這段時間很悠閒吧！", 0]	GREET	t12-17	1	\N
10	["現在是晚餐時間呢！", 0]	GREET	t17-19	1	\N
11	["晚上好！", 0]	GREET	t19-22	1	\N
12	["深夜聊天時間～", 0]	GREET	t22-03	1	\N
13	["你在一個很奇怪的時間點上線呢！", 0]	GREET	t03-05	1	\N
14	["{}是現在最多人前往的學校", 0]	GREET	sch	1	\N
15	["推薦你去{}！ 目前做多人使用", 0]	GREET	sch	2	\N
16	["如果我是你，我就去{}！ 人多機會多", 0]	GREET	sch	3	\N
\.


--
-- Data for Name: chat_game; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_game (id, name, "isAdult", "isHetero", best_ratio, threshold_ratio, game_id, story) FROM stdin;
1	TEST畢業舞會後的畢業女孩	t	t	[2, 1]	[1, 1]	test_graduate_girl	\N
2	畢業後的第一夜	t	t	[2, 1]	[1, 1]	graduate_girl	[["以下劇本是由<span class='a-point'>偵探</span>的視角進行", 0, "s"], ["", 0, "w"], ["===大學畢業晚會===", 0, "s"], ["(今天是我們最後一天待在學校了 突然有點感傷...)", 0, "m"], ["(突然有人叫住我...)", 0, "m"], ["<span class='a-point'>好姐妹</span>：誒！過了今天我們就不再是大學生了耶！ 要不要來做一些特別的事～", 0, "a"], ["說什麼呀 妳是喝醉了哦？", 0, "m"], ["<span class='a-point'>好姐妹</span>：哈哈 等等要不要跟他們去續攤呀？", 0, "a"], ["他們...？", 0, "m"], ["<span class='a-point'>好姐妹</span>：你傻呀！就是剛剛那群人呀！ 我看妳剛剛也玩得很開心呀", 0, "a"], ["哪有！ 那他們要去哪續攤？", 0, "m"], ["<span class='a-point'>好姐妹</span>：妳看妳明明就很有興趣！ 我去問一下好了，我猜應該是學校旁邊的酒吧！ 妳真的要去齁？", 0, "a"], ["應該可吧！ 但我不能玩太晚哦", 0, "m"], ["好姐妹：知道啦，我們走吧！", 0, "a"], ["", 0, "w"], ["", 0, "w"], ["。", 0, "m"], ["。。", 0, "m"], ["。。。", 0, "m"], ["====隔天早上====", 0, "s"], ["(我在宿舍醒來...)", 0, "m"], ["我怎麼......", 0, "m"], ["<span class='a-point'>好姐妹</span>：誒 妳昨天很誇張耶！ 真看不出來妳比我還會玩～ 哈哈", 0, "a"], ["我...？", 0, "m"], ["<span class='a-point'>好姐妹</span>：對呀 還被帥哥帶出場～", 0, "a"], ["怎麼可能！？", 0, "m"], ["<span class='a-point'>好姐妹</span>：真的呀！ 連我也嚇了一跳 認識妳四年 都沒看過妳這麼主動哈哈哈", 0, "a"], ["為什麼我完全沒印象......", 0, "m"], ["<span class='a-point'>好姐妹</span>：哈哈哈我也沒仔細看！ 喝到最後很多人都茫了～", 0, "a"], ["(這個男生是誰呀？ 完全記不起來...... 總之先回去那間酒吧看看吧)", 0, "m"], ["", 0, "w"]]
\.


--
-- Data for Name: chat_gameevent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_gameevent (id, name, content, "group", game_id) FROM stdin;
1	與偵探發生關係	 	0	2
2	吐了滿地	酒吧外面有嘔吐物，如果不是我，就是有人酒量不好吐了滿地。	0	2
3	與其他人發生爭執	酒吧裡有打鬥的痕跡，看來有人在這邊發生過爭執。	0	2
4	不勝酒力直接睡在酒吧	有堆疊過的靠墊，可能有人喝醉後就直接在這睡著了。	0	2
5	打翻了桌上的食物	地上有滿地食物，是不是有人不小心打翻了食物？	0	2
6	打牌輸了一堆錢	桌上有雜亂的僕克牌堆，有人昨天打了一晚上的牌。	0	2
7	帶家裡的小狗來擋酒	酒吧內有小狗的咬痕，看來有人帶狗狗來續攤了。	0	2
8	與偵探的好姐妹待在廁所	廁所內有用過的保險套，難怪好姐妹昨天在廁所待這麼久。	0	2
9	偵探本人	 	1	2
\.


--
-- Data for Name: chat_gamerole; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_gamerole (id, name, gender, game_id, "group") FROM stdin;
1	偵探	f	2	1
2	打工的同事	m	2	0
3	系上學長	m	2	0
4	系上學弟	m	2	0
5	他系學伴	m	2	0
6	通識課同學	m	2	0
7	校草	m	2	0
\.


--
-- Data for Name: chat_match; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_match (id, player_list, room_id) FROM stdin;
1	["f873ae91-4c2a-4fe0-a5d5-c4555525714a", "e2abf309-688e-4fd3-b825-72fdb8a83d44"]	24
2	[]	29
3	["2fa45349-a749-4ccc-843a-bf690fa544ee", "e2abf309-688e-4fd3-b825-72fdb8a83d44"]	29
4	["2fa45349-a749-4ccc-843a-bf690fa544ee", "e2abf309-688e-4fd3-b825-72fdb8a83d44"]	29
13	["2fa45349-a749-4ccc-843a-bf690fa544ee", "e2abf309-688e-4fd3-b825-72fdb8a83d44"]	29
14	["2fa45349-a749-4ccc-843a-bf690fa544ee", "e2abf309-688e-4fd3-b825-72fdb8a83d44"]	29
16	["2fa45349-a749-4ccc-843a-bf690fa544ee"]	29
17	["2fa45349-a749-4ccc-843a-bf690fa544ee"]	29
18	["2fa45349-a749-4ccc-843a-bf690fa544ee"]	29
19	["2fa45349-a749-4ccc-843a-bf690fa544ee"]	29
20	["2fa45349-a749-4ccc-843a-bf690fa544ee"]	29
21	["2fa45349-a749-4ccc-843a-bf690fa544ee", "e2abf309-688e-4fd3-b825-72fdb8a83d44"]	29
22	["2fa45349-a749-4ccc-843a-bf690fa544ee"]	29
\.


--
-- Data for Name: chat_photo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_photo (id, image, upload_date, uploader, "isForAdult") FROM stdin;
1	photo/IMG_2146.jpg	2021-09-23 22:38:38.328+08	802bd4a977594bf2b079c8e4423819a3	f
2	photo/IMG_2146_zzahHMZ.jpg	2021-09-23 23:03:41.546+08	802bd4a977594bf2b079c8e4423819a3	f
3	photo/IMG_2146_ynd3wNH.jpg	2021-09-23 23:11:55.582+08	802bd4a977594bf2b079c8e4423819a3	f
4	photo/IMG_2146_wZpdaVK.jpg	2021-09-23 23:12:23.683+08	802bd4a977594bf2b079c8e4423819a3	f
5	photo/IMG_2146_658i5rk.jpg	2021-09-23 23:13:11.517+08	802bd4a977594bf2b079c8e4423819a3	f
6	photo/802bd4a9-7759-4bf2-b079-c8e4423819a30923151457.jpg	2021-09-23 23:14:57.04+08	802bd4a977594bf2b079c8e4423819a3	f
7	photo/802bd4a9-7759-4bf2-b079-c8e4423819a30923151721.jpg	2021-09-23 23:17:21.441+08	802bd4a977594bf2b079c8e4423819a3	f
8	photo/802bd4a9-7759-4bf2-b079-c8e4423819a30923152355.jpg	2021-09-23 23:23:55.521+08	802bd4a977594bf2b079c8e4423819a3	f
9	photo/0f945b4d1013173259681312.jpg	2021-10-14 01:32:59.681+08	0f945b4d	f
10	photo/0f945b4d1013175711381371.jpg	2021-10-14 01:57:11.381+08	0f945b4d	f
11	photo/0f945b4d1013180144270194.jpg	2021-10-14 02:01:44.27+08	0f945b4d	f
12	photo/0f945b4d1013180206284787.jpg	2021-10-14 02:02:06.284+08	0f945b4d	f
13	photo/0f945b4d1013225913496709.jpg	2021-10-14 06:59:13.496+08	0f945b4d	f
14	photo/0f945b4d1013230036249187.jpg	2021-10-14 07:00:36.249+08	0f945b4d	f
15	photo/918052d81013231642325967.jpg	2021-10-14 07:16:42.325+08	918052d8	f
16	photo/0f945b4d1013231706079143.jpg	2021-10-14 07:17:06.079+08	0f945b4d	f
17	photo/0f945b4d1013232009054650.jpg	2021-10-14 07:20:09.054+08	0f945b4d	f
18	photo/0f945b4d1013232816303361.jpg	2021-10-14 07:28:16.303+08	0f945b4d	f
19	photo/0f945b4d1013232932464031.jpg	2021-10-14 07:29:32.464+08	0f945b4d	f
20	photo/0f945b4d1013233130673172.jpg	2021-10-14 07:31:30.673+08	0f945b4d	f
21	photo/918052d81013233145442884.jpg	2021-10-14 07:31:45.442+08	918052d8	f
22	photo/918052d81013233204602207.jpg	2021-10-14 07:32:04.602+08	918052d8	f
23	photo/0f945b4d1016035702554714.jpeg	2021-10-16 11:57:02.554+08	0f945b4d	f
24	photo/1afdcfae1103163156795398.jpeg	2021-11-04 00:31:56.795+08	1afdcfae	f
25	photo/1afdcfae1103164523021525.jpeg	2021-11-04 00:45:23.021+08	1afdcfae	f
\.


--
-- Data for Name: chat_player; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_player (uuid, name, create_date, "isBanned", room_id, waiting_time, status, "imgUrl_adult", user_id, gender, tag_int, "isAdult", "isHetero", game_id, "isPrepared", tag_json, "isOn", match_id, city_id) FROM stdin;
2fa45349-a749-4ccc-843a-bf690fa544ee	!@#$%^&*()_+}:Q"WMDO	2021-12-02 18:02:31+08	f	29	2022-01-01 19:36:24+08	2	\N	29	m	0	t	t	graduate_girl	f	{}	f	\N	\N
e2abf309-688e-4fd3-b825-72fdb8a83d44	森林@#$%!~()<>?:"{}+*_	2021-12-02 15:29:08+08	f	29	\N	2	\N	26	f	-1	t	t	graduate_girl	f	{"message": [], "2fa45349-a749-4ccc-843a-bf690fa544ee": 1, "e2abf309-688e-4fd3-b825-72fdb8a83d44": 0, "f873ae91-4c2a-4fe0-a5d5-c4555525714a": 0}	f	\N	\N
f873ae91-4c2a-4fe0-a5d5-c4555525714a	好的	2021-12-02 17:30:56+08	f	29	\N	2	\N	28	m	0	t	t	graduate_girl	f	{}	t	1	\N
\.


--
-- Data for Name: chat_room; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_room (id, game_id, onoff_dict, player_dict, create_date, answer, city_id) FROM stdin;
27	2	{"2fa45349-a749-4ccc-843a-bf690fa544ee": 1, "e2abf309-688e-4fd3-b825-72fdb8a83d44": -1, "f873ae91-4c2a-4fe0-a5d5-c4555525714a": 1}	{"2fa45349-a749-4ccc-843a-bf690fa544ee": ["!@#$%^&*()_+}:Q\\"WMDO", "m", "系上學弟", 0], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["森林@#$%!~()<>?:\\"{}+*_", "f", "偵探", 1], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["好的", "m", "他系學伴", 0]}	2021-12-28 17:26:23.245+08	{"noplayer0": ["與其他人發生爭執", "酒吧裡有打鬥的痕跡，看來有人在這邊發生過爭執。"], "noplayer1": ["不勝酒力直接睡在酒吧", "有堆疊過的靠墊，可能有人喝醉後就直接在這睡著了。"], "2fa45349-a749-4ccc-843a-bf690fa544ee": ["與偵探發生關係", " "], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["偵探本人", " "], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["打牌輸了一堆錢", "桌上有雜亂的僕克牌堆，有人昨天打了一晚上的牌。"]}	\N
22	2	{"2fa45349-a749-4ccc-843a-bf690fa544ee": -1, "e2abf309-688e-4fd3-b825-72fdb8a83d44": -1, "f873ae91-4c2a-4fe0-a5d5-c4555525714a": -1}	{"2fa45349-a749-4ccc-843a-bf690fa544ee": ["!@#$%^&*()_+}:Q\\"WMDO", "m", "系上學弟", 0], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["森林@#$%!~()<>?:\\"{}+*_", "f", "偵探", 1], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["好的", "m", "打工的同事", 0]}	2021-12-28 17:01:07.36+08	{"noplayer0": ["打翻了桌上的食物", "地上有滿地食物，是不是有人不小心打翻了食物？"], "noplayer1": ["吐了滿地", "酒吧外面有嘔吐物，如果不是我，就是有人酒量不好吐了滿地。"], "2fa45349-a749-4ccc-843a-bf690fa544ee": ["與偵探發生關係", " "], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["偵探本人", " "], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["與其他人發生爭執", "酒吧裡有打鬥的痕跡，看來有人在這邊發生過爭執。"]}	\N
28	2	{"2fa45349-a749-4ccc-843a-bf690fa544ee": -1, "e2abf309-688e-4fd3-b825-72fdb8a83d44": -1, "f873ae91-4c2a-4fe0-a5d5-c4555525714a": -1}	{"2fa45349-a749-4ccc-843a-bf690fa544ee": ["!@#$%^&*()_+}:Q\\"WMDO", "m", "校草", 0], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["森林@#$%!~()<>?:\\"{}+*_", "f", "偵探", 1], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["好的", "m", "打工的同事", 0]}	2021-12-28 17:32:29.987+08	{"noplayer0": ["帶家裡的小狗來擋酒", "酒吧內有小狗的咬痕，看來有人帶狗狗來續攤了。"], "noplayer1": ["打牌輸了一堆錢", "桌上有雜亂的僕克牌堆，有人昨天打了一晚上的牌。"], "2fa45349-a749-4ccc-843a-bf690fa544ee": ["不勝酒力直接睡在酒吧", "有堆疊過的靠墊，可能有人喝醉後就直接在這睡著了。"], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["偵探本人", " "], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["與偵探發生關係", " "]}	\N
23	2	{"2fa45349-a749-4ccc-843a-bf690fa544ee": 1, "e2abf309-688e-4fd3-b825-72fdb8a83d44": 1, "f873ae91-4c2a-4fe0-a5d5-c4555525714a": 1}	{"2fa45349-a749-4ccc-843a-bf690fa544ee": ["!@#$%^&*()_+}:Q\\"WMDO", "m", "系上學弟", 0], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["森林@#$%!~()<>?:\\"{}+*_", "f", "偵探", 1], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["好的", "m", "他系學伴", 0]}	2021-12-28 17:09:40.121+08	{"noplayer0": ["吐了滿地", "酒吧外面有嘔吐物，如果不是我，就是有人酒量不好吐了滿地。"], "noplayer1": ["帶家裡的小狗來擋酒", "酒吧內有小狗的咬痕，看來有人帶狗狗來續攤了。"], "2fa45349-a749-4ccc-843a-bf690fa544ee": ["與其他人發生爭執", "酒吧裡有打鬥的痕跡，看來有人在這邊發生過爭執。"], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["偵探本人", " "], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["與偵探發生關係", " "]}	\N
24	2	{"2fa45349-a749-4ccc-843a-bf690fa544ee": 1, "e2abf309-688e-4fd3-b825-72fdb8a83d44": 1, "f873ae91-4c2a-4fe0-a5d5-c4555525714a": 1}	{"2fa45349-a749-4ccc-843a-bf690fa544ee": ["!@#$%^&*()_+}:Q\\"WMDO", "m", "系上學弟", 0], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["森林@#$%!~()<>?:\\"{}+*_", "f", "偵探", 1], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["好的", "m", "打工的同事", 0]}	2021-12-28 17:11:25.325+08	{"noplayer0": ["不勝酒力直接睡在酒吧", "有堆疊過的靠墊，可能有人喝醉後就直接在這睡著了。"], "noplayer1": ["與其他人發生爭執", "酒吧裡有打鬥的痕跡，看來有人在這邊發生過爭執。"], "2fa45349-a749-4ccc-843a-bf690fa544ee": ["吐了滿地", "酒吧外面有嘔吐物，如果不是我，就是有人酒量不好吐了滿地。"], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["偵探本人", " "], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["與偵探發生關係", " "]}	\N
25	2	{"2fa45349-a749-4ccc-843a-bf690fa544ee": 1, "e2abf309-688e-4fd3-b825-72fdb8a83d44": 1, "f873ae91-4c2a-4fe0-a5d5-c4555525714a": 1}	{"2fa45349-a749-4ccc-843a-bf690fa544ee": ["!@#$%^&*()_+}:Q\\"WMDO", "m", "系上學長", 0], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["森林@#$%!~()<>?:\\"{}+*_", "f", "偵探", 1], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["好的", "m", "系上學弟", 0]}	2021-12-28 17:20:04.667+08	{"noplayer0": ["打翻了桌上的食物", "地上有滿地食物，是不是有人不小心打翻了食物？"], "noplayer1": ["不勝酒力直接睡在酒吧", "有堆疊過的靠墊，可能有人喝醉後就直接在這睡著了。"], "2fa45349-a749-4ccc-843a-bf690fa544ee": ["與偵探發生關係", " "], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["偵探本人", " "], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["與其他人發生爭執", "酒吧裡有打鬥的痕跡，看來有人在這邊發生過爭執。"]}	\N
26	2	{"2fa45349-a749-4ccc-843a-bf690fa544ee": -1, "e2abf309-688e-4fd3-b825-72fdb8a83d44": 1, "f873ae91-4c2a-4fe0-a5d5-c4555525714a": -1}	{"2fa45349-a749-4ccc-843a-bf690fa544ee": ["!@#$%^&*()_+}:Q\\"WMDO", "m", "打工的同事", 0], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["森林@#$%!~()<>?:\\"{}+*_", "f", "偵探", 1], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["好的", "m", "校草", 0]}	2021-12-28 17:23:18.694+08	{"noplayer0": ["吐了滿地", "酒吧外面有嘔吐物，如果不是我，就是有人酒量不好吐了滿地。"], "noplayer1": ["與偵探的好姐妹待在廁所", "廁所內有用過的保險套，難怪好姐妹昨天在廁所待這麼久。"], "2fa45349-a749-4ccc-843a-bf690fa544ee": ["與偵探發生關係", " "], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["偵探本人", " "], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["帶家裡的小狗來擋酒", "酒吧內有小狗的咬痕，看來有人帶狗狗來續攤了。"]}	\N
29	2	{"2fa45349-a749-4ccc-843a-bf690fa544ee": 0, "e2abf309-688e-4fd3-b825-72fdb8a83d44": 0, "f873ae91-4c2a-4fe0-a5d5-c4555525714a": 1}	{"2fa45349-a749-4ccc-843a-bf690fa544ee": ["!@#$%^&*()_+}:Q\\"WMDO", "m", "校草", 0], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["森林@#$%!~()<>?:\\"{}+*_", "f", "偵探", 1], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["好的", "m", "他系學伴", 0]}	2021-12-28 23:07:56.93+08	{"noplayer0": ["與其他人發生爭執", "酒吧裡有打鬥的痕跡，看來有人在這邊發生過爭執。"], "noplayer1": ["帶家裡的小狗來擋酒", "酒吧內有小狗的咬痕，看來有人帶狗狗來續攤了。"], "2fa45349-a749-4ccc-843a-bf690fa544ee": ["與偵探的好姐妹待在廁所", "廁所內有用過的保險套，難怪好姐妹昨天在廁所待這麼久。"], "e2abf309-688e-4fd3-b825-72fdb8a83d44": ["偵探本人", " "], "f873ae91-4c2a-4fe0-a5d5-c4555525714a": ["與偵探發生關係", " "]}	\N
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
1	2021-12-10 21:50:32.769+08	2	graduate_girl	3		14	30
2	2021-12-10 21:50:32.776+08	1	test_graduate_girl	3		14	30
3	2021-12-13 00:42:36.795+08	7	room-7	3		8	30
4	2021-12-13 00:42:36.798+08	6	room-6	3		8	30
5	2021-12-13 00:42:36.8+08	5	room-5	3		8	30
6	2021-12-13 00:42:36.801+08	4	room-4	3		8	30
7	2021-12-13 00:42:36.803+08	3	room-3	3		8	30
8	2022-01-12 17:54:58.954+08	f873ae91-4c2a-4fe0-a5d5-c4555525714a	好的 (f873ae91-4c2a-4fe0-a5d5-c4555525714a)	2	[{"changed": {"fields": ["School", "Game"]}}]	9	30
9	2022-01-12 18:17:57.366+08	e2abf309-688e-4fd3-b825-72fdb8a83d44	森林@#$%!~()<>?:"{}+*_ (e2abf309-688e-4fd3-b825-72fdb8a83d44)	2	[{"changed": {"fields": ["Game"]}}]	9	30
10	2022-01-12 18:18:04.551+08	2fa45349-a749-4ccc-843a-bf690fa544ee	!@#$%^&*()_+}:Q"WMDO (2fa45349-a749-4ccc-843a-bf690fa544ee)	2	[{"changed": {"fields": ["Game"]}}]	9	30
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	chat	question
8	chat	room
9	chat	player
10	chat	photo
11	chat	school
12	chat	dialogue
13	chat	robot
14	chat	game
15	chat	gamerole
16	chat	gameevent
17	chat	match
18	chat	city
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2022-01-21 09:16:04.370355+08
2	auth	0001_initial	2022-01-21 09:16:04.439829+08
3	admin	0001_initial	2022-01-21 09:16:04.45455+08
4	admin	0002_logentry_remove_auto_add	2022-01-21 09:16:04.46263+08
5	admin	0003_logentry_add_action_flag_choices	2022-01-21 09:16:04.470656+08
6	contenttypes	0002_remove_content_type_name	2022-01-21 09:16:04.491136+08
7	auth	0002_alter_permission_name_max_length	2022-01-21 09:16:04.499718+08
8	auth	0003_alter_user_email_max_length	2022-01-21 09:16:04.509015+08
9	auth	0004_alter_user_username_opts	2022-01-21 09:16:04.516339+08
10	auth	0005_alter_user_last_login_null	2022-01-21 09:16:04.523596+08
11	auth	0006_require_contenttypes_0002	2022-01-21 09:16:04.524843+08
12	auth	0007_alter_validators_add_error_messages	2022-01-21 09:16:04.533202+08
13	auth	0008_alter_user_username_max_length	2022-01-21 09:16:04.545293+08
14	auth	0009_alter_user_last_name_max_length	2022-01-21 09:16:04.552407+08
15	auth	0010_alter_group_name_max_length	2022-01-21 09:16:04.562026+08
16	auth	0011_update_proxy_permissions	2022-01-21 09:16:04.569325+08
17	auth	0012_alter_user_first_name_max_length	2022-01-21 09:16:04.576387+08
18	chat	0001_initial	2022-01-21 09:16:04.708182+08
19	chat	0002_alter_dialogue_dialog	2022-01-21 09:16:04.712444+08
20	chat	0003_alter_dialogue_dialog	2022-01-21 09:16:04.748907+08
21	chat	0004_alter_dialogue_dialog	2022-01-21 09:16:04.753035+08
22	chat	0005_remove_school_url	2022-01-21 09:16:04.757914+08
23	chat	0006_alter_photo_uploader	2022-01-21 09:16:04.777819+08
24	chat	0007_alter_photo_uploader	2022-01-21 09:16:04.78693+08
25	chat	0008_auto_20211004_1204	2022-01-21 09:16:04.831111+08
26	chat	0009_auto_20211004_2329	2022-01-21 09:16:04.840438+08
27	chat	0010_auto_20211006_1221	2022-01-21 09:16:04.85834+08
28	chat	0011_auto_20211011_1522	2022-01-21 09:16:04.87303+08
29	chat	0012_auto_20211025_1140	2022-01-21 09:16:04.885694+08
30	chat	0013_school_roomnum	2022-01-21 09:16:04.891673+08
31	chat	0014_auto_20211101_0039	2022-01-21 09:16:04.913904+08
32	chat	0015_alter_player_score	2022-01-21 09:16:04.920219+08
33	chat	0016_auto_20211108_1553	2022-01-21 09:16:04.938542+08
34	chat	0017_player_user	2022-01-21 09:16:04.949584+08
35	chat	0018_player_registered	2022-01-21 09:16:04.961095+08
36	chat	0019_player_gender	2022-01-21 09:16:04.96956+08
37	chat	0020_auto_20211128_1657	2022-01-21 09:16:04.98112+08
38	chat	0021_auto_20211128_1707	2022-01-21 09:16:05.047217+08
39	chat	0022_auto_20211128_1954	2022-01-21 09:16:05.16679+08
40	chat	0023_auto_20211129_1302	2022-01-21 09:16:05.216784+08
41	chat	0024_rename_role_gamerole	2022-01-21 09:16:05.235013+08
42	chat	0025_auto_20211129_1724	2022-01-21 09:16:05.281646+08
43	chat	0026_game_game_id	2022-01-21 09:16:05.287544+08
44	chat	0027_player_tag_json	2022-01-21 09:16:05.305397+08
45	chat	0028_player_ison	2022-01-21 09:16:05.317883+08
46	chat	0029_rename_registered_player_isregistered	2022-01-21 09:16:05.331083+08
47	chat	0030_auto_20211202_2132	2022-01-21 09:16:05.350724+08
48	chat	0031_auto_20211203_1544	2022-01-21 09:16:05.394666+08
49	chat	0032_auto_20211203_1701	2022-01-21 09:16:05.423888+08
50	chat	0033_auto_20211208_1618	2022-01-21 09:16:05.486457+08
51	chat	0034_remove_room_school	2022-01-21 09:16:05.501003+08
52	chat	0035_room_school	2022-01-21 09:16:05.53102+08
53	chat	0036_auto_20211210_1341	2022-01-21 09:16:05.58905+08
54	chat	0037_auto_20211210_1345	2022-01-21 09:16:05.682548+08
55	chat	0038_alter_game_game_id	2022-01-21 09:16:05.690838+08
56	chat	0039_remove_dialogue_speaker	2022-01-21 09:16:05.704948+08
57	chat	0040_auto_20211211_0014	2022-01-21 09:16:05.708377+08
58	chat	0041_city	2022-01-21 09:16:05.714954+08
59	chat	0042_auto_20211217_1649	2022-01-21 09:16:05.730819+08
60	chat	0043_auto_20211231_2221	2022-01-21 09:16:05.798435+08
61	chat	0044_auto_20220111_1024	2022-01-21 09:16:05.824608+08
62	chat	0045_auto_20220112_1750	2022-01-21 09:16:06.061772+08
63	chat	0046_auto_20220112_1759	2022-01-21 09:16:06.137969+08
64	chat	0047_alter_player_game	2022-01-21 09:16:06.16454+08
65	chat	0048_remove_player_isregistered	2022-01-21 09:16:06.177049+08
66	sessions	0001_initial	2022-01-21 09:16:06.184174+08
67	chat	0002_auto_20220121_1438	2022-01-21 14:39:03.781627+08
68	chat	0003_alter_photo_uploader	2022-01-21 14:42:23.539564+08
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
0ywr2lvbpe68keyvcnkn21qzsmt2df2q	.eJxVjEEOwiAQRe_C2hBgoHRcuu8ZyAygVA0kpV0Z765NutDtf-_9lwi0rSVsPS9hTuIsQInT78gUH7nuJN2p3pqMra7LzHJX5EG7nFrKz8vh_h0U6uVbR6RIFpmVZhxwMMAJPDt2yqnRGc_gSGuHGS1YxvGKWQEYnRMkVF68P_o4N0Q:1mvbvV:Iw-lEE3YYTi5nHCvQJoxFWeFCoGpyLSczPOhkuf2Zss	2021-12-24 17:10:49.695+08
4om4xisl3rc9highflg3ajckk3hy3831	.eJxVjEEOwiAQRe_C2hBgoHRcuu8ZyAygVA0kpV0Z765NutDtf-_9lwi0rSVsPS9hTuIsQInT78gUH7nuJN2p3pqMra7LzHJX5EG7nFrKz8vh_h0U6uVbR6RIFpmVZhxwMMAJPDt2yqnRGc_gSGuHGS1YxvGKWQEYnRMkVF68P_o4N0Q:1mwRwK:zNXNeHu0baAIbAZDKCxLo3uaFn-YRAjLiFTbHDMW6_0	2021-12-27 00:43:08.403+08
72rcqvwejxev8rub6bhyznj61r5yac7f	.eJxVjEEOwiAQRe_C2hBgoHRcuu8ZyAygVA0kpV0Z765NutDtf-_9lwi0rSVsPS9hTuIsQInT78gUH7nuJN2p3pqMra7LzHJX5EG7nFrKz8vh_h0U6uVbR6RIFpmVZhxwMMAJPDt2yqnRGc_gSGuHGS1YxvGKWQEYnRMkVF68P_o4N0Q:1mvYtK:V8PmP9wKAzeckLmAyjEKC51Q9vq5BYTU4sl5U4De0oY	2021-12-24 13:56:22.279+08
bc6t2ywexclpajo8cy8mlpntu3b9tnsv	.eJxVjEEOwiAQRe_C2hBgoHRcuu8ZyAygVA0kpV0Z765NutDtf-_9lwi0rSVsPS9hTuIsQInT78gUH7nuJN2p3pqMra7LzHJX5EG7nFrKz8vh_h0U6uVbR6RIFpmVZhxwMMAJPDt2yqnRGc_gSGuHGS1YxvGKWQEYnRMkVF68P_o4N0Q:1n7a7P:vmykum3UE7UFN5vroaeZncU49YgB9U_4sSHc6OukJro	2022-01-26 17:40:35.798+08
muzzwqj5wg42tbrhww1y6tza3jbht3gl	.eJxVjEEOwiAQRe_C2hBgoHRcuu8ZyAygVA0kpV0Z765NutDtf-_9lwi0rSVsPS9hTuIsQInT78gUH7nuJN2p3pqMra7LzHJX5EG7nFrKz8vh_h0U6uVbR6RIFpmVZhxwMMAJPDt2yqnRGc_gSGuHGS1YxvGKWQEYnRMkVF68P_o4N0Q:1n8C3T:hlDJJTggy09pf_rnnYjPweX6j2rZyVgZoiIUZ8Vflg8	2022-01-28 10:11:03.847+08
tb1vj2vz235u6k5m2jseptv3iejju4yv	.eJxVjEEOwiAQRe_C2hBgoHRcuu8ZyAygVA0kpV0Z765NutDtf-_9lwi0rSVsPS9hTuIsQInT78gUH7nuJN2p3pqMra7LzHJX5EG7nFrKz8vh_h0U6uVbR6RIFpmVZhxwMMAJPDt2yqnRGc_gSGuHGS1YxvGKWQEYnRMkVF68P_o4N0Q:1n7a0H:xvQEmzWe8JH8pytbHtFwpb6aTZdCVUU2PCJ29_kM62s	2022-01-26 17:33:13.792+08
tsh92wvzv6ynuw2fkqr5fscdnwc1xa0l	.eJxVjEEOwiAQRe_C2hBgoHRcuu8ZyAygVA0kpV0Z765NutDtf-_9lwi0rSVsPS9hTuIsQInT78gUH7nuJN2p3pqMra7LzHJX5EG7nFrKz8vh_h0U6uVbR6RIFpmVZhxwMMAJPDt2yqnRGc_gSGuHGS1YxvGKWQEYnRMkVF68P_o4N0Q:1mwRud:1j7FeCBxAFtfDhzbwX-qdJUlQ6KpgbzDlzSJ_waON-w	2021-12-27 00:41:23.106+08
ze2xiudn8ia1rpkqkc0yq4spcb7w4vdo	.eJxVjMsOwiAQAP-FsyG8uoJH734D2WWpVA0kpT0Z_92Q9KDXmcm8RcR9K3HveY0Li4swXpx-IWF65joMP7Dem0ytbutCciTysF3eGufX9Wj_BgV7GV9KDlVIViPZCTRbCGA4BE2zyR6NTcpAmBQxK5uyAgsI5B0op-E8i88X_Kw3Zg:1nAYVm:ctT08zfVZpQqGLzHOTDgPmfjBWFCguILPEcSTPo__7U	2022-02-03 22:34:02.365+08
\.


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 76, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 30, true);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: chat_city_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_city_id_seq', 23, true);


--
-- Name: chat_dialogue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_dialogue_id_seq', 16, true);


--
-- Name: chat_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_game_id_seq', 2, true);


--
-- Name: chat_gameevent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_gameevent_id_seq', 9, true);


--
-- Name: chat_match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_match_id_seq', 22, true);


--
-- Name: chat_photo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_photo_id_seq', 25, true);


--
-- Name: chat_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_role_id_seq', 7, true);


--
-- Name: chat_room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_room_id_seq', 29, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 10, true);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 18, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 68, true);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: chat_city chat_city_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_city
    ADD CONSTRAINT chat_city_name_key UNIQUE (name);


--
-- Name: chat_city chat_city_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_city
    ADD CONSTRAINT chat_city_pkey PRIMARY KEY (id);


--
-- Name: chat_dialogue chat_dialogue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_dialogue
    ADD CONSTRAINT chat_dialogue_pkey PRIMARY KEY (id);


--
-- Name: chat_game chat_game_game_id_5b576163_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_game
    ADD CONSTRAINT chat_game_game_id_5b576163_uniq UNIQUE (game_id);


--
-- Name: chat_game chat_game_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_game
    ADD CONSTRAINT chat_game_pkey PRIMARY KEY (id);


--
-- Name: chat_gameevent chat_gameevent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_gameevent
    ADD CONSTRAINT chat_gameevent_pkey PRIMARY KEY (id);


--
-- Name: chat_match chat_match_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_match
    ADD CONSTRAINT chat_match_pkey PRIMARY KEY (id);


--
-- Name: chat_photo chat_photo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_photo
    ADD CONSTRAINT chat_photo_pkey PRIMARY KEY (id);


--
-- Name: chat_player chat_player_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_player
    ADD CONSTRAINT chat_player_pkey PRIMARY KEY (uuid);


--
-- Name: chat_player chat_player_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_player
    ADD CONSTRAINT chat_player_user_id_key UNIQUE (user_id);


--
-- Name: chat_gamerole chat_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_gamerole
    ADD CONSTRAINT chat_role_pkey PRIMARY KEY (id);


--
-- Name: chat_room chat_room_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_room
    ADD CONSTRAINT chat_room_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: chat_city_name_b9790080_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_city_name_b9790080_like ON public.chat_city USING btree (name varchar_pattern_ops);


--
-- Name: chat_dialogue_game_id_b00ab77a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_dialogue_game_id_b00ab77a ON public.chat_dialogue USING btree (game_id);


--
-- Name: chat_game_game_id_5b576163_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_game_game_id_5b576163_like ON public.chat_game USING btree (game_id varchar_pattern_ops);


--
-- Name: chat_gameevent_game_id_88ff76b2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_gameevent_game_id_88ff76b2 ON public.chat_gameevent USING btree (game_id);


--
-- Name: chat_match_room_id_ff4146ea; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_match_room_id_ff4146ea ON public.chat_match USING btree (room_id);


--
-- Name: chat_player_city_id_7d5a7ca5; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_player_city_id_7d5a7ca5 ON public.chat_player USING btree (city_id);


--
-- Name: chat_player_city_id_7d5a7ca5_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_player_city_id_7d5a7ca5_like ON public.chat_player USING btree (city_id varchar_pattern_ops);


--
-- Name: chat_player_game_id_02c6d028; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_player_game_id_02c6d028 ON public.chat_player USING btree (game_id);


--
-- Name: chat_player_match_id_837d8701; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_player_match_id_837d8701 ON public.chat_player USING btree (match_id);


--
-- Name: chat_player_room_id_af282472; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_player_room_id_af282472 ON public.chat_player USING btree (room_id);


--
-- Name: chat_role_game_id_d28ee820; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_role_game_id_d28ee820 ON public.chat_gamerole USING btree (game_id);


--
-- Name: chat_room_city_id_f1688133; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_room_city_id_f1688133 ON public.chat_room USING btree (city_id);


--
-- Name: chat_room_city_id_f1688133_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_room_city_id_f1688133_like ON public.chat_room USING btree (city_id varchar_pattern_ops);


--
-- Name: chat_room_game_id_b1b0c39f; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_room_game_id_b1b0c39f ON public.chat_room USING btree (game_id);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chat_dialogue chat_dialogue_game_id_b00ab77a_fk_chat_game_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_dialogue
    ADD CONSTRAINT chat_dialogue_game_id_b00ab77a_fk_chat_game_id FOREIGN KEY (game_id) REFERENCES public.chat_game(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chat_gameevent chat_gameevent_game_id_88ff76b2_fk_chat_game_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_gameevent
    ADD CONSTRAINT chat_gameevent_game_id_88ff76b2_fk_chat_game_id FOREIGN KEY (game_id) REFERENCES public.chat_game(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chat_match chat_match_room_id_ff4146ea_fk_chat_room_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_match
    ADD CONSTRAINT chat_match_room_id_ff4146ea_fk_chat_room_id FOREIGN KEY (room_id) REFERENCES public.chat_room(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chat_player chat_player_city_id_7d5a7ca5_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_player
    ADD CONSTRAINT chat_player_city_id_7d5a7ca5_fk FOREIGN KEY (city_id) REFERENCES public.chat_city(name) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chat_player chat_player_game_id_02c6d028_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_player
    ADD CONSTRAINT chat_player_game_id_02c6d028_fk FOREIGN KEY (game_id) REFERENCES public.chat_game(game_id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chat_player chat_player_match_id_837d8701_fk_chat_match_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_player
    ADD CONSTRAINT chat_player_match_id_837d8701_fk_chat_match_id FOREIGN KEY (match_id) REFERENCES public.chat_match(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chat_player chat_player_room_id_af282472_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_player
    ADD CONSTRAINT chat_player_room_id_af282472_fk FOREIGN KEY (room_id) REFERENCES public.chat_room(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chat_player chat_player_user_id_2d5014f9_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_player
    ADD CONSTRAINT chat_player_user_id_2d5014f9_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chat_gamerole chat_role_game_id_d28ee820_fk_chat_game_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_gamerole
    ADD CONSTRAINT chat_role_game_id_d28ee820_fk_chat_game_id FOREIGN KEY (game_id) REFERENCES public.chat_game(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chat_room chat_room_city_id_f1688133_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_room
    ADD CONSTRAINT chat_room_city_id_f1688133_fk FOREIGN KEY (city_id) REFERENCES public.chat_city(name) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chat_room chat_room_game_id_b1b0c39f_fk_chat_game_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_room
    ADD CONSTRAINT chat_room_game_id_b1b0c39f_fk_chat_game_id FOREIGN KEY (game_id) REFERENCES public.chat_game(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

