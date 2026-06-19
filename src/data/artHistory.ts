export interface ArtHistoryEgg {
  id: string;
  title: string;
  content: string;
  category: 'technique' | 'history' | 'symbolism' | 'artist';
}

export const ART_HISTORY_EGGS: ArtHistoryEgg[] = [
  {
    id: 'uv-tech',
    category: 'technique',
    title: '紫外线诱导荧光成像 (UVF)',
    content:
      '紫外线照射会使古老油彩中的某些成分发出荧光。林布兰白（铅白）在紫外下呈现淡蓝白色，而后期补笔的钛白则呈现暗褐色。修复师正是利用这种荧光差异，区分原画与后世补色。',
  },
  {
    id: 'ir-tech',
    category: 'technique',
    title: '红外反射成像 (IRR)',
    content:
      '红外线可以穿透油画表层的色釉和清漆，直达底层的炭笔或银尖笔底稿（sinopia / underdrawing）。文艺复兴时期画家如达·芬奇、扬·凡·艾克都有极其精细的底稿留存，IR 技术让 500 年后的我们得以看到画家最初的草图、修改痕迹甚至手指印。',
  },
  {
    id: 'solvent-tech',
    category: 'technique',
    title: '溶剂法清漆去除',
    content:
      '油画完成后通常会涂刷一层天然树脂清漆（达玛脂、玛蒂脂）保护画面。数百年后清漆会变黄、龟裂。修复师使用有机溶剂（如丙酮、乙醇的凝胶制剂）逐步溶解清漆，整个过程以微米计，不容失误。一旦过度，会伤及下方色层。',
  },
  {
    id: 'hermetic',
    category: 'symbolism',
    title: '赫尔墨斯主义与隐写术',
    content:
      '15-16 世纪的佛罗伦萨，新柏拉图主义与赫尔墨斯主义盛行。菲奇诺、皮科·德拉·米兰多拉等人翻译了《赫尔墨斯文集》，认为其中包含古埃及的隐秘智慧。艺术家（尤其是与美第奇家族有联系者）常将赫尔墨斯符号以隐写方式藏入宗教画，以躲避宗教裁判所的审查。',
  },
  {
    id: 'inverted-cross',
    category: 'symbolism',
    title: '倒十字的双重含义',
    content:
      '倒十字（圣彼得十字）在天主教中本是谦卑的象征——圣彼得认为自己不配与基督同向受刑。但在 19 世纪后被浪漫主义文学赋予了反叛意味。在本作所暗示的 1525 年，它很可能指涉「地下玫瑰十字会」的早期成员。',
  },
  {
    id: 'pentagram',
    category: 'symbolism',
    title: '五芒星与黄金分割',
    content:
      '正五芒星中每条线段都被交点分割为黄金比例 φ ≈ 1.618。这一几何性质令新柏拉图主义者着迷。同时，五芒星的五个顶点也对应火水土气灵五元素。在本作中，它被绘制于紫外可见层，暗示其炼金内涵。',
  },
  {
    id: 'perspective',
    category: 'history',
    title: '布鲁内莱斯基与线性透视',
    content:
      '1415 年左右，佛罗伦萨建筑师布鲁内莱斯基通过镜像实验发现了线性透视法。此后阿尔贝蒂在《论绘画》(1435) 中将其理论化。到 1525 年，透视已是画家必备技艺。底稿中多个消失点的存在，说明作者是一名受过严格训练的精通几何的画家。',
  },
  {
    id: 'alchemista',
    category: 'artist',
    title: '「Alchemista」是谁？',
    content:
      '1525 年佛罗伦萨活跃着多位兼具画家与炼金术士身份的人物。帕尔米贾尼诺曾沉迷炼金术导致手部残疾；而更著名的是——据说米开朗基罗少年时也曾在美第奇花园学习解剖与炼金术。「Alchemista MDXXV」这个签名，可能是某位不愿暴露身份的大师的假名。',
  },
  {
    id: 'medici',
    category: 'history',
    title: '美第奇家族的秘密收藏',
    content:
      '美第奇家族的科西莫一世建立了欧洲第一个「奇珍馆」(Studiolo)，收藏异教雕像、神秘文稿、炼金术器具。1494 年萨伏那洛拉焚烧「虚饰之物」时，许多藏品被秘密转移。本作若为美第奇旧藏，其隐写内容极可能关联家族秘传。',
  },
  {
    id: 'steganography',
    category: 'technique',
    title: '艺术史中的隐写术',
    content:
      '隐写术 (Steganography) 一词源自希腊语「隐藏的书写」。已知最早的艺术隐写是达利与迪斯尼的《命运》中嵌入的隐藏图像；而更古老的例子包括：中世纪手抄本页边画、荷兰画派的「画中谜」(emblem) 以及中国书画中的「隐题诗」。本游戏正是向这一古老传统致敬。',
  },
];

export const VICTORY_TEXT = {
  headline: '密码解锁成功',
  subheadline: '真相，在五百年后重见天日',
  paragraphs: [
    '你输入了最后一位数字——咔哒——画框背面的暗格弹开了。里面是一张泛黄的羊皮纸，用铁胆墨水书写着赫尔墨斯式的密文：',
    '"Visita Interiora Terrae, Rectificando Invenies Occultum Lapidem."',
    '（「探寻大地的内心，净化之后，你将找到隐藏的石头。」——这是炼金术「维特鲁威人密码」，每句首字母连起来是 V.I.T.R.I.O.L.，意为「哲人石」）',
    '羊皮纸下方，还有一行小字：「致发现此信的修复师：你证明了自己配得上这门技艺。——A. MDXXV」',
    '博物馆的日光灯下，你感到一丝凉意。原来，所谓的艺术品修复，不仅仅是保存美——更是与五百年来选择沉默的大师，进行一场跨越时空的对话。',
  ],
};
