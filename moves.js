(function(){
  window.MOVES = {
    idle:{name:"構え",dur:1,frames:[{t:0,pose:"idle"}]},

    ap:{name:"アプチャギ",dur:340,damage:5,bal:8,kb:18,range:105,height:-10,hit:[.45,.62],frames:[
      {t:0,pose:"load"},{t:.28,pose:"knee"},{t:.52,pose:"front",trail:"short"},{t:1,pose:"idle"}
    ]},

    dol:{name:"トルリョチャギ",dur:420,damage:8,bal:10,kb:30,range:125,height:-35,hit:[.50,.68],frames:[
      {t:0,pose:"load"},{t:.30,pose:"knee"},{t:.58,pose:"round",trail:"round"},{t:1,pose:"idle"}
    ]},

    putcho:{name:"プッチョ",dur:250,damage:4,bal:6,kb:14,range:112,height:-35,hit:[.34,.54],frames:[
      {t:0,pose:"stepIn",x:10},{t:.30,pose:"putchoLoad",x:26},{t:.48,pose:"putcho",x:36,trail:"snap"},{t:1,pose:"idle",x:42}
    ]},

    milgi:{name:"押し蹴り",dur:390,damage:3,bal:14,kb:72,range:138,height:-18,hit:[.42,.70],push:true,frames:[
      {t:0,pose:"stepIn",x:12},{t:.25,pose:"pushLoad",x:28},{t:.55,pose:"pushKick",x:45,trail:"push"},{t:1,pose:"idle",x:50}
    ]},

    rot:{name:"回転フェイント",dur:470,frames:[
      {t:0,pose:"closed",y:-8,trail:"bodySpin1"},
      {t:.38,pose:"back",trail:"bodySpin2"},
      {t:.64,pose:"closed",y:-8,trail:"bodySpin3"},
      {t:1,pose:"idle"}
    ]},

    dwit:{name:"ティッチャギ",dur:410,damage:12,bal:18,kb:46,range:160,height:-62,hit:[.56,.76],heavy:true,frames:[
      {t:0,pose:"closed",y:-8,trail:"bodySpin1"},
      {t:.22,pose:"back",y:-3,trail:"bodySpin2"},
      {t:.40,pose:"backLoad",y:-6,trail:"bodySpin3"},
      {t:.64,pose:"backKick",y:-8,trail:"straight"},
      {t:1,pose:"idle"}
    ]},

    huri:{name:"ティフリギ",dur:470,damage:14,bal:22,kb:54,range:145,height:-95,hit:[.54,.78],heavy:true,frames:[
      {t:0,pose:"closed",y:-8,trail:"bodySpin1"},
      {t:.20,pose:"back",y:-4,trail:"bodySpin2"},
      {t:.38,pose:"backKick",y:-8,trail:"straight"},
      {t:.62,pose:"hook",y:-5,trail:"ellipse"},
      {t:1,pose:"idle"}
    ]},

    na:{name:"ネリョチャギ",dur:470,damage:10,bal:12,kb:24,range:112,height:-35,hit:[.52,.72],frames:[
      {t:0,pose:"load"},{t:.30,pose:"axeUp",trail:"axe"},{t:.62,pose:"axeDown",trail:"axe"},{t:1,pose:"idle"}
    ]},

    jumpHuri:{name:"跳びティフリギ",dur:580,damage:17,bal:26,kb:70,range:150,height:-88,hit:[.42,.68],heavy:true,frames:[
      {t:0,pose:"jumpLoad",trail:"bodySpin1"},
      {t:.25,pose:"jumpBack",y:-26,trail:"straight"},
      {t:.50,pose:"jumpHook",y:-20,trail:"ellipse"},
      {t:.75,pose:"land"},{t:1,pose:"idle"}
    ]},

    retDol:{name:"下がりトルリョチャギ",dur:470,damage:7,bal:9,kb:28,range:125,height:-35,hit:[.38,.58],frames:[
      {t:0,pose:"retreat",x:-20},{t:.45,pose:"round",x:-45,trail:"round"},{t:1,pose:"idle",x:-55}
    ]},

    retDwit:{name:"下がり跳びティッチャギ",dur:540,damage:12,bal:18,kb:48,range:160,height:-62,hit:[.36,.60],heavy:true,frames:[
      {t:0,pose:"jumpLoad",x:-10,trail:"bodySpin1"},
      {t:.42,pose:"jumpBack",x:-55,y:-24,trail:"straight"},
      {t:1,pose:"idle",x:-65}
    ]}
  };
})();
