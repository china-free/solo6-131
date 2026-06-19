export type ClueId =
  | 'uv_cross_count'
  | 'uv_pentagram'
  | 'ir_perspective_points'
  | 'ir_grid_origin'
  | 'star_north_node'
  | 'star_alignment'
  | 'solvent_signature'
  | 'solvent_roman_numerals'
  | 'solvent_elements'
  | 'stack_intersection';

export interface ClueHotspot {
  id: ClueId;
  x: number;
  y: number;
  radius: number;
  requiredTools: ToolType[];
  title: string;
  description: string;
  hint?: string;
}

export type ToolType = 'none' | 'uv' | 'ir' | 'solvent' | 'stack' | 'grid';

export type LayerId = 'varnish' | 'uv' | 'ir' | 'starmap' | 'solvent' | 'glow' | 'overlay';

export interface PerspectivePoint {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface StarData {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  brightness: number;
  isKey: boolean;
  connectedTo?: string[];
}

export interface UvSymbol {
  type: 'inverted-cross' | 'pentagram' | 'number';
  x: number;
  y: number;
  size: number;
  value?: string;
}

export interface SolventElement {
  type: 'signature' | 'roman' | 'element-symbol';
  x: number;
  y: number;
  size: number;
  value: string;
}

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 1000;

export const PASSWORD_ANSWER: [string, string, string, string] = ['2', '7', '3', '4'];

export const PASSWORD_LOGIC = [
  '紫外层中发现 1 个倒十字符号 × 2 = 2',
  '星图层「北交点星」对应 IR 网格 x 坐标十位数 = 7',
  '红外层 4 个透视消失点中，星图对齐的是第 3 号点 = 3',
  '溶剂层 MDXXV 罗马数字中不同字符的种数 = 4',
];

export const UV_SYMBOLS: UvSymbol[] = [
  { type: 'inverted-cross', x: 120, y: 180, size: 50 },
  { type: 'pentagram', x: 680, y: 220, size: 60 },
  { type: 'number', x: 200, y: 820, size: 40, value: 'VII' },
  { type: 'number', x: 600, y: 860, size: 36, value: '3' },
];

export const PERSPECTIVE_POINTS: PerspectivePoint[] = [
  { id: 1, x: 150, y: 500, label: 'VP-1' },
  { id: 2, x: 400, y: 300, label: 'VP-2 (地平线中心)' },
  { id: 3, x: 720, y: 450, label: 'VP-3 ★ 关键' },
  { id: 4, x: 400, y: 800, label: 'VP-4' },
];

export const STARS: StarData[] = [
  { id: 's1', name: '北交点星 (North Node)', x: 720, y: 450, size: 5, brightness: 1, isKey: true, connectedTo: ['s2', 's5'] },
  { id: 's2', name: '织女星', x: 150, y: 500, size: 4, brightness: 0.9, isKey: false, connectedTo: ['s3'] },
  { id: 's3', name: '天津四', x: 250, y: 250, size: 3, brightness: 0.7, isKey: false, connectedTo: ['s4'] },
  { id: 's4', name: '牛郎星', x: 550, y: 180, size: 3, brightness: 0.8, isKey: false, connectedTo: ['s5'] },
  { id: 's5', name: '心宿二', x: 400, y: 300, size: 4, brightness: 0.85, isKey: true, connectedTo: [] },
  { id: 's6', name: '参宿四', x: 100, y: 750, size: 3, brightness: 0.75, isKey: false },
  { id: 's7', name: '天狼星', x: 680, y: 780, size: 4, brightness: 0.95, isKey: false },
  { id: 's8', name: '老人星', x: 380, y: 880, size: 2, brightness: 0.6, isKey: false },
  { id: 's9', name: '水委一', x: 60, y: 120, size: 2, brightness: 0.55, isKey: false },
  { id: 's10', name: '毕宿五', x: 740, y: 95, size: 3, brightness: 0.7, isKey: false },
  { id: 's11', name: '角宿一', x: 330, y: 600, size: 3, brightness: 0.8, isKey: false },
  { id: 's12', name: '大角星', x: 470, y: 680, size: 2, brightness: 0.65, isKey: false },
];

export const SOLVENT_REVEALS: SolventElement[] = [
  { type: 'signature', x: 400, y: 920, size: 28, value: 'Alchemista' },
  { type: 'roman', x: 400, y: 960, size: 22, value: 'MDXXV' },
  { type: 'element-symbol', x: 80, y: 90, size: 40, value: 'fire' },
  { type: 'element-symbol', x: 720, y: 90, size: 40, value: 'water' },
  { type: 'element-symbol', x: 80, y: 920, size: 40, value: 'earth' },
  { type: 'element-symbol', x: 720, y: 920, size: 40, value: 'air' },
];

export const CLUE_HOTSPOTS: ClueHotspot[] = [
  {
    id: 'uv_cross_count',
    x: 120, y: 180, radius: 60,
    requiredTools: ['uv'],
    title: '倒十字符号',
    description: '紫外光下，画面左上浮现一个倒十字（彼得十字）。这是 16 世纪秘密教派常用的隐写记号。',
    hint: '数量: 1 个。密码第 1 位 = 数量 × 2',
  },
  {
    id: 'uv_pentagram',
    x: 680, y: 220, radius: 65,
    requiredTools: ['uv'],
    title: '五芒星标记',
    description: '右上的五芒星是赫尔墨斯主义的象征。注意它和下方星图的对位关系。',
  },
  {
    id: 'ir_perspective_points',
    x: 400, y: 500, radius: 200,
    requiredTools: ['ir'],
    title: '透视消失点',
    description: '红外碳稿揭示了 4 个消失点（VP-1 ~ VP-4），构成画家最初的几何构图骨架。',
    hint: '关键消失点的编号对应密码某一位',
  },
  {
    id: 'ir_grid_origin',
    x: 400, y: 300, radius: 50,
    requiredTools: ['ir', 'grid'],
    title: '网格原点坐标',
    description: 'VP-2 位于网格 (7, 3) 列。所有 x 坐标的基准以此建立。',
    hint: '北交点星在网格中 x = 720，其十位数即第 2 位密码',
  },
  {
    id: 'star_north_node',
    x: 720, y: 450, radius: 40,
    requiredTools: ['stack'],
    title: '北交点星 ★ 关键线索',
    description: '星图中的「北交点星」精准落在 IR 层的 VP-3 消失点上！x = 720',
    hint: '坐标 x=720 的十位数是 7 → 密码第 2 位 = 7',
  },
  {
    id: 'star_alignment',
    x: 400, y: 400, radius: 200,
    requiredTools: ['stack'],
    title: '星图连线对齐',
    description: '星图连线穿过了 3 个消失点。中心星座「心宿二」对齐 VP-2。',
    hint: '与北交点星重合的是第 3 号消失点 VP-3',
  },
  {
    id: 'solvent_signature',
    x: 400, y: 930, radius: 120,
    requiredTools: ['solvent'],
    title: '画家签名',
    description: '清漆溶解后，显现签名：「Alchemista, MDXXV」— 炼金术士，1525 年。',
  },
  {
    id: 'solvent_roman_numerals',
    x: 400, y: 960, radius: 60,
    requiredTools: ['solvent'],
    title: '罗马数字 MDXXV',
    description: 'MDXXV = 1525。字符: M(1000), D(500), X(10), X(10), V(5)',
    hint: 'M, D, X, V 共 4 种不同字符 → 密码第 4 位 = 4',
  },
  {
    id: 'solvent_elements',
    x: 400, y: 500, radius: 400,
    requiredTools: ['solvent'],
    title: '四元素符号',
    description: '四角出现火、水、土、气四元素符号，对应帕拉塞尔苏斯炼金术传统。',
  },
  {
    id: 'stack_intersection',
    x: 400, y: 500, radius: 300,
    requiredTools: ['stack'],
    title: '叠图交叉密码',
    description: 'UV+IR+星图三层叠合后，线索汇总：1×2=2，十位=7，VP-3=3，字符种数=4',
    hint: '★ 完整密码: 2 7 3 4',
  },
];

export const PAINTING_META = {
  title: '《圣母子与施洗者圣约翰》',
  titleEn: 'Madonna and Child with St. John the Baptist',
  artist: '署名「Alchemista」— 真实身份待考证',
  year: '约 1525 年',
  origin: '佛罗伦萨，美第奇家族旧藏',
  dimensions: '80cm × 100cm',
  medium: '木板蛋彩 + 亚麻布油彩 + 清漆',
  provenance: '1942 年从某私人收藏转入博物馆，入藏记录缺失关键信息。2019 年修复时发现清漆层异常，怀疑存在隐写层。',
};
