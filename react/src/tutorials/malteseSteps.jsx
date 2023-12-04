const steps = [
	{
		selector: '.primary-target',
		content:
			"Merhba min ghand it-tim ta Lista. Jekk jogħġbok segwi l-passi biex tikseb ħarsa rapida l-app jew skopriha waħdek, billi tagħfas fuq 'X', jew ximkien barra mill-kaxxa mdawla. tista' terġa' tibda t-tutorja mis-settings aktar tard!",
	},
	{
		selector: '.first-step',
		content: 'Agħfas in-Navbar biex tiftaħ is-setting tal-paġna prinċipali',
	},
	{
		selector: '.second-step',

		content:
			"Tista' taqleb bejn il-Malti u l-Ingliż. Jekk tixtieq tara dan it-tutorja bil-Ingliz jekk jogħġbok aqleb mill-Malti ghal l-Ingliż u aġġorna l-paġna",
	},
	{
		selector: '.third-step',
		content: 'Agħfas biex tbiddel it-thema għal dak skur jew ċara hawn',
	},
	{
		selector: '.forth-step',
		content: "Tista' terġa' tara t-tutorja jew tkompli minn fejn ħallejt billi tagħfas hawn",
	},
	{
		selector: '.fifth-step',
		content:
			"Tista' tagħżel li tidħol fl-account tieghek jew tirreġistra kont magħna biex qatt ma titlef il-listi tax-xiri tiegħek, jew taċċessahom minn kwalunkwe apparat, kullimkien!",
	},
	{
		selector: '.first-step',
		content: 'agħfas fuq in-navbar biex tagħlaqha',
	},
	{
		selector: '.sixth-step',
		content: 'Agħfas din il-buttuna biex toħloq lista ġdida',
	},
	{
		selector: '.create-step',
		content: 'Daħħal isem għal-lista tiegħek (minimu 3 ittri) u agħfas il-buttuna',
	},
	{
		selector: '.generatedList-step',
		content: "Il-listi ġġenerati ġodda se jidhru hawn. inti tista 'toħloq aktar minn 1 lista",
	},
	{
		selector: '.sixth-step-1',
		content: 'Dan huwa t-tracker tal-għadd tal-prodotti',
	},
	{
		selector: '.sixth-step-2',
		content: 'Din hija progress-bar animata għal kull lista',
	},
	{
		selector: '.setting-step',
		content: 'Aghfas hawn biex tiftaħ is-settings għal-lista individwali',
	},
	{
		selector: '.setting-step-1',
		content: "Tista' tibdel l-isem tal-listi jew billi tagħfas l-isem mill-ġdid, jew tikklikkja fuq l-isem tal-listi",
	},
	{
		selector: '.setting-step-2',
		content: "Tista' tikkopja l-lista u l-kontenut kollu tagħha",
	},
	{
		selector: '.setting-step-3',
		content:
			"Tista' taqsam lista u l-kontenut tagħha mal-familja u l-ħbieb tiegħek! tikseb aġġornamenti f'ħin reali meta l-oġġetti jitpoggew jew jitneħħew. żomm rekord ta' dak kollu li hemm fid-dar b'lista wahda biss.. meta tagħfas din tiġġenera link u tiġi miżjuda awtomatikament fil clip-board tiegħek għal qsim faċli",
	},
	{
		selector: '.setting-step-4',
		content: 'Finalment ħassar lista minn hawn',
	},
	{
		selector: '.list-exit',
		content: 'Agħfas hawn u agħlaq is-settings tal-lista',
	},
	{
		selector: '.to-product-page',
		content: 'Agħfas fuq il-lista biex tmur fil-paġna tal-prodott',
	},
	{
		selector: '.add-products-button',
		content: 'Agħfas din il-buttuna biex iżżid prodott ġdid mal-lista tiegħek',
	},
	{
		selector: '.product-to-choose',
		content: 'Dawn huma l-prodotti li huma popolati minn qabel',
	},
	{
		selector: '.product-selector',
		content: 'Agħżel prodott billi tagħfas hawn',
	},
	{
		selector: '.product-deselector',
		content: 'Neħħi prodott billi tagħfas hawn',
	},
	{
		selector: '.nav-1',
		content: ' Organizza l-prodotti bl-addoċċ jew skont il-kategorija',
	},

	{
		selector: '.nav-2',
		content: 'Prodotti popolati minn qabel',
	},

	{
		selector: '.search-product',
		content: 'Fittex prodott speċifiku bl-isem Ingliż jew Malti tiegħu',
	},
	{
		selector: '.nav-3',
		content: 'Ikklikkja hawn biex iżżid il-prodotti tad-dwana tiegħek stess!',
	},

	{
		selector: '.add-custom',
		content: 'Daħħal isem (minimu 3 ittri) għall-prodott tiegħek u agħfas il-buttuna żid',
	},

	{
		selector: '.custom-list',
		content: 'Il-prodotti tiegħek se joħorġu hawn',
	},
	{
		selector: '.custom-select',
		content: 'Żid il-prodott tiegħek mal-lista tiegħek',
	},
	{
		selector: '.custom-edit',
		content: 'Agħfas fiċ-ċentru tal-prodott biex teditjah',
	},
	{
		selector: '.product-edit',
		content: 'Editja prodotti A billi timla d-dettalji u ssejvjah',
	},

	{
		selector: '.custom-remove',
		content: "Agħfas 'X' biex tneħħi l-għażla tal-prodott",
	},
	{
		selector: '.custom-delete',
		content: 'Hassar il-prodott tieghek',
	},
	{
		selector: '.nav-2',
		content: 'ejja mmorru lura u agħżel aktar prodotti',
	},
	{
		selector: '.product-to-choose',
		content: 'Aghzel 3 prodotti jew izjed',
	},
	{
		selector: '.close-btn',
		content: 'agħfas biex tmur lura għal-lista tiegħek',
	},
	{
		selector: '.product-container',
		content: 'Prodotti magħżula se jidhru hawn',
	},
	{
		selector: '.mark-ready',
		content: 'Immarka prodott jew 2 bħala lest u proċedi',
	},
	{
		selector: '.search-inList',
		content: 'Ikklikkja hawn u fittex prodott, Lest jew le!',
	},

	{
		selector: '.settings-products',
		content: "Settings għall-prodotti f'din il-lista speċifika",
	},
	{
		selector: '.product-edit',
		content: 'Editja l-prodott għal din il-lista speċifika minn hawn!',
	},
	{
		selector: '.remove-product-to-buy',
		content: 'Neħħi prodott mil-lista biex jinxtraw',
	},
	{
		selector: '.remove-product-ready',
		content: 'Neħħi prodott mil-lista biex mixrija',
	},
	{
		selector: '.final',
		content:
			'Grazzi talli rajt it-tutorja, nittama li din il-lista tagħmel ix-xiri mal-familja u l-ħbieb aktar pjaċevoli u ta divertiment. jekk għandek xi suġġeriment dwar kif nistgħu nimprovjaw jew biex inżidu prodott speċifiku jekk jogħġbok, toqgħodx lura milli ikkuntattjani permezz tal-portafoll tiegħi, Grazzi',
	},
];
 export default steps